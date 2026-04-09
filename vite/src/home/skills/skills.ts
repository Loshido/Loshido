const SIZE = 96
const container = document.getElementById('skills') as HTMLDivElement
const bound = container.getBoundingClientRect()
const [width, height] = [bound.width - SIZE, 320 - SIZE]

const rand_angle = () => rand(Math.PI * -0.5) // [1.5pi-2pi]
const rand = (max: number, min?: number) => (min ?? 0) + Math.random() * (max - (min ?? 0))

function compute_position(initial_angle?: number) {
    const angle = initial_angle ?? rand_angle()

    const tan = Math.tan(angle);

    const right_side = Math.abs(tan * width) <= height
    const x = right_side ? width : height / tan
    const y = right_side ? tan * width : height

    const max = Math.sqrt(x ** 2 + y ** 2);
    const distance = rand(max, max * 0.66)

    return { distance, angle }
}

export default function update(image: HTMLImageElement | SVGSVGElement) {
    const { distance, angle } = compute_position()

    const x = distance * Math.cos(angle)
    const y = distance * Math.sin(angle)

    const FROM = `--from: 0px 0px;`
    const TO = `--to: ${x}px ${-y}px;`;
    const ROTATE = `--rotate-from: ${rand(-20)}deg;--rotate-to: ${rand(20)}deg;`
    const DELAY = `animation-delay: ${image.style.animationDelay};`
    image.setAttribute('style', FROM + TO + DELAY + ROTATE)
}