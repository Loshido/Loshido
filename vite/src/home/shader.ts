const VERTEX_SRC = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uBrightness;
uniform vec3 uGlowColor;
uniform float uLineWidth;

out vec4 fragColor;

// ---------- Hash ----------
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

// ---------- Distance segment ----------
float segment(vec2 p, vec2 a, vec2 b, float thickness) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return smoothstep(thickness, thickness * 0.4, length(pa - ba * h));
}

// ---------- Glyphes ASCII proceduraux ----------
float glyph(int index, vec2 p) {
    float d = 0.0;
    float t = 0.09;

    if (index == 1) {
        d = smoothstep(0.10, 0.0, length(p - vec2(0.0, -0.18)));
    } else if (index == 2) {
        d = smoothstep(0.09, 0.0, length(p - vec2(0.0, 0.16)));
        d += smoothstep(0.09, 0.0, length(p - vec2(0.0, -0.16)));
    } else if (index == 3) {
        d += segment(p, vec2(-0.28, 0.0), vec2(0.28, 0.0), t);
        d += segment(p, vec2(0.0, -0.28), vec2(0.0, 0.28), t);
    } else if (index == 4) {
        d += segment(p, vec2(-0.26, 0.0), vec2(0.26, 0.0), t);
        d += segment(p, vec2(0.0, -0.26), vec2(0.0, 0.26), t);
        d += segment(p, vec2(-0.18, -0.18), vec2(0.18, 0.18), t);
        d += segment(p, vec2(-0.18, 0.18), vec2(0.18, -0.18), t);
    } else if (index == 5) {
        d += segment(p, vec2(-0.3, -0.15), vec2(0.3, -0.15), t);
        d += segment(p, vec2(-0.3, 0.15), vec2(0.3, 0.15), t);
        d += segment(p, vec2(-0.15, -0.3), vec2(-0.15, 0.3), t);
        d += segment(p, vec2(0.15, -0.3), vec2(0.15, 0.3), t);
    } else if (index == 6) {
        float ring = abs(length(p) - 0.26);
        d += smoothstep(t, t * 0.3, ring);
        d += smoothstep(0.07, 0.0, length(p));
    }

    return clamp(d, 0.0, 1.0);
}

// ---------- Bruit value simple ----------
float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// ---------- Formules mathematiques ----------
float formulaDistance(vec2 cellId, float time, vec2 resolution) {
    float x = cellId.x;
    float y = cellId.y;
    float d = 1e6;
    float cellSize = 22.0;

    // Parabole y = x^2 centree a 50% de l'ecran
    float centerX = resolution.x / cellSize * 0.5;
    float centerY = resolution.y / cellSize * 0.5;
    float maxDistX = centerX;
    // Echelle calculee pour que la parabole tienne dans ~80% de la hauteur disponible
    float scale = (centerY * 0.7) / (maxDistX * maxDistX);
    float expectedY = scale * (x - centerX * 0.1) * (x - centerX * 0.1) * 0.5;
    d = abs(y - expectedY);

    return d;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    float cellSize = 22.0;
    vec2 gridPos = fragCoord / cellSize;
    vec2 cellId = floor(gridPos);
    vec2 localUv = fract(gridPos) - 0.5;

    float changeSpeed = 0.5;
    float timeSlot = floor(uTime * changeSpeed);
    float charRand = hash(vec3(cellId, timeSlot));
    int index = int(charRand * 7.0);
    float g = glyph(index, localUv);

    // Distance a la formule mathematique
    float dist = formulaDistance(cellId, uTime, uResolution);

    // ---------- Illumination large et aleatoire ----------
    float t = uTime;
    float w = uLineWidth;

    float wave1 = sin(cellId.x * 0.8 - t * 4.0) * 0.5 + 0.5;
    float wave2 = sin(cellId.x * 0.4 - t * 2.5 + 1.5) * 0.5 + 0.5;
    float ripple = sin(cellId.x * 2.0 - t * 12.0) * 0.5 + 0.5;

    float sparkle = hash(vec2(floor(cellId.x * 0.25), floor(t * 4.0)));
    sparkle = pow(sparkle, 5.0) * 4.0;

    float flicker = hash(vec2(cellId.x, floor(t * 8.0)));
    float illumination = 0.25 + 0.4 * wave1 + 0.3 * wave2 + 0.15 * ripple + sparkle + 0.2 * flicker;

    // Profil d'illumination : tres lumineux au centre, bruit sur les cotes
    float core = 1.0 - smoothstep(0.0, w * 0.3, dist);
    float shoulder = 1.0 - smoothstep(w * 0.3, w, dist);
    float sideNoise = pow(valueNoise(vec2(cellId * 3.0 + t * 5.0)), 2.0);
    float sideGlow = (1.0 - smoothstep(w, w * 3.0, dist)) * sideNoise * 0.6;

    float lineIntensity = core * 1.0 + shoulder * 0.5 + sideGlow;
    float diagIntensity = lineIntensity * illumination;

    // ---------- Couleurs ----------
    // Texte hors ligne : GRIS CLAIR (modifie ici)
    vec3 offLineColor = vec3(1.0, 1.0, 1.0) * g * 0.9;

    // Couleur d'illumination configurable (inchangee)
    vec3 glow = uGlowColor * diagIntensity * g;

    // Halo diffus autour de la ligne
    float halo = 1.0 - smoothstep(0.0, w * 4.0, dist);
    float haloPulse = sin(t * 2.0 + cellId.x * 0.15) * 0.3 + 0.7;
    vec3 haloColor = uGlowColor * halo * haloPulse * 0.08;

    vec3 finalColor = offLineColor + glow + haloColor;
    finalColor *= uBrightness;

    float alpha = clamp(max(finalColor.r, max(finalColor.g, finalColor.b)) * 3.0, 0.0, 1.0);
    
    fragColor = vec4(finalColor, alpha);
}`

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw ("Erreur de compilation du shader: " + info)
    }
    return shader
}

function createProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program)
        throw ("Erreur de link du programme: " + info)
    }
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return program
}

function setupContext(gl: WebGL2RenderingContext) {
    const program = createProgram(gl, VERTEX_SRC, FRAGMENT_SRC)
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const vertices = new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ])

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    
    return {
        vao,
        uResolution: gl.getUniformLocation(program, "uResolution"),
        uTime: gl.getUniformLocation(program, "uTime"),
        uBrightness: gl.getUniformLocation(program, "uBrightness"),
        uGlowColor: gl.getUniformLocation(program, "uGlowColor"),
        uLineWidth: gl.getUniformLocation(program, "uLineWidth")
    }
}

function resize(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
    }
}

const canvas = document.getElementById("canvas-shader") as HTMLCanvasElement
const gl = canvas.getContext('webgl2')
if (!gl) throw "WebGL2 non supporte"

const { vao, uResolution, uBrightness, uGlowColor, uLineWidth, uTime } = setupContext(gl)
const start = performance.now()
const brightness = 0.1
const glowColor = [67, 203, 148]
const lineWidth =  window.innerWidth > 900 ? 3 : 2
let intersecting = true

function frame() {
    resize(canvas, gl!)
    const time = (performance.now() - start) / 1000

    gl!.uniform2f(uResolution, canvas.width, canvas.height)
    gl!.uniform1f(uTime, time)
    gl!.uniform1f(uBrightness, brightness)
    gl!.uniform3f(uGlowColor, glowColor[0], glowColor[1], glowColor[2])
    gl!.uniform1f(uLineWidth, lineWidth)

    gl!.clearColor(0.0, 0.0, 0.0, 0.0)
    gl!.clear(gl!.COLOR_BUFFER_BIT)

    gl!.bindVertexArray(vao)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)

    if(!intersecting) {
        console.debug("[CANVAS] - Stopping, out of screen")
        return
    } 
    requestAnimationFrame(frame)
}

const resizeObserver = new ResizeObserver(() => resize(canvas, gl))
const intersectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.target.id !== "canvas-shader") return
    if(entry.isIntersecting && !intersecting) {
        console.debug("[CANVAS] - Starting, in screen")
        requestAnimationFrame(frame)
    }
    intersecting = entry.isIntersecting
}))

resizeObserver.observe(canvas)
intersectionObserver.observe(canvas)

resize(canvas, gl)
requestAnimationFrame(frame)