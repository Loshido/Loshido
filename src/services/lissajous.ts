// lissajous -> svg

interface Params {
    gradient: {
        [stop: string]: [number, number, number]
    }

    // ([1, 10], [1, 10])
    ab: [number, number]
    // ([0, 2pi], [0, 2pi])
    phases: [number, number]

    // nombre de points
    n: number 
    // [0,1] 0 -> traits droits, 1 -> traits courbés
    tension: number,
    // rayon du dessin par rapport au centre
    rayon: number
    // taille du dessin (diametre + marge)
    taille: number
}
type Point = [number, number]


function courbe(p: Params): Point[] {
    const points: Point[] = []
    const [a, b] = p.ab
    const [phaseX, phaseY] = p.phases

    for(let i = 0; i < p.n; i++) {
        const t = Math.PI * i / p.n 
        const x = p.rayon * Math.sin(a * t + phaseX)
        const y = p.rayon * Math.sin(b * t + phaseY)
        points.push([x, y])
    }
    return points
}

function getCatmullRomControlPoints(points: [Point, Point, Point, Point], tension: number) {
    // spline entre p1 et p2
    const [p0, p1, p2, p3] = points
    const dx1 = (p2[0] - p0[0]) * tension
    const dy1 = (p2[1] - p0[1]) * tension
    const dx2 = (p3[0] - p1[0]) * tension
    const dy2 = (p3[1] - p1[1]) * tension

    return [
        [
            p1[0] + dx1 / 3, 
            p1[1] + dy1 / 3
        ], 
        [
            p2[0] - dx2 / 3, 
            p2[1] - dy2 / 3
        ]
    ]
}

function svgPath(points: Point[], p: Params): string {
    if (points.length < 4) return "";
    
    let path = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;

    // On ferme la ligne
    const extendedPoints = [...points, points[0], points[1], points[2]];

    for(let i = 1; i < points.length; i++) {
        const [c1, c2] = getCatmullRomControlPoints(
            extendedPoints.slice(i - 1, i + 3) as Parameters<typeof getCatmullRomControlPoints>[0], 
            p.tension
        )

        const C1 = c1.map(n => n.toFixed(2)).join(',')
        const C2 = c2.map(n => n.toFixed(2)).join(',')
        const P2 = extendedPoints[i + 1].map(n => n.toFixed(2)).join(',')

        path += `C${C1} ${C2} ${P2}`
    }
    
    return path + ' Z'
}

function generateSVG(path: string, p: Params) {
    let stops = ''
    Object.entries(p.gradient).forEach(([stop, hsl]) => {
        const [h, s, l] = hsl
        stops += `<stop offset="${ stop }%" stop-color="hsl(${ h }, ${ s }%, ${ l }%)" />`
    })

    return `<svg width="${ p.taille }" height="${ p.taille }" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="col">
                ${ stops }
                <stop offset="90%" stop-color="rgba(0, 0, 0, 0)" />
            </linearGradient>
        </defs>
        <g transform="translate(${ Math.floor(p.taille / 2) }, ${ Math.floor(p.taille / 2) })">
            <path d="${path}" fill="none" stroke="url(#col)" stroke-width="2"/>
        </g>
    </svg>`
}

const randFromSeed = (seed: number, id: number) => {
    let t = seed
    t ^= t << 13
    t ^= t >> 17
    t ^= t << id
    return (t >>> 0) / 4294967296
}
const randS = (max: number, min: number, seed: number, id: number) => min + Math.floor(randFromSeed(seed, id) * max)
const generateParams = (seed: number): Params => {
    const s = seed
    const p: Params =  {
        gradient: {},
        ab: [6, 8],
        phases: [randS(2 * Math.PI, 0, s, 1), randS(2 * Math.PI, 0, s, 2)],

        // nombre de points
        n: 50,
        // [0,1] 0 -> traits droits, 1 -> traits courbés
        tension: 0.5,

        rayon: 150,
        taille: 400
    }

    const stops = randS(5, 1, s, 3)
    for(let i = 0; i < stops; i++) {
        const stop = randS(80, 0, s, 4 + i * 4)
        p.gradient[stop] = [
            randS(360, 0, s, 5 + i * 4), 
            randS(100, 50, s, 6 + i * 4), 
            randS(100, 0, s, 7 + i * 4)
        ]
    }
    return p
}
const hash = (str: string) => {
    let hash = 0x881c9dc5
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i)
        hash = Math.imul(hash, 0x01000193)
    }
    return hash >>> 0
}

export default (hostname: string): string => {
    const p = generateParams(hash(hostname))
    const points = courbe(p)

    const path = svgPath(points, p)
    const svg = generateSVG(path, p)
    return svg
}