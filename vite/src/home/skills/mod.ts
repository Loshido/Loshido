import update from './skills'
import './style.css'

const skills = [
    'rust',
    'kube',
    'docker',
    'golang',
    'figma',
    'pg',
    'prometheus',
    'solid',
    'ts',
    'vite'
].map(skill => fetch(`/assets/tech/${skill}.svg`))

const responses = await Promise.all(skills)
const svgs = await Promise.all(
    responses.filter(r => r.ok)
        .map(async response => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(await response.text(), "image/svg+xml")

            return doc.querySelector("svg")!
        })
)

const parent = document.getElementById('skills-container')!
for(const skill of svgs) {
    parent.appendChild(skill)
    skill.style.animationDelay = Math.floor(Math.random() * 10000) + 'ms'
    update(skill)
    skill.addEventListener('animationiteration', () => update(skill))
}

// const targets = document.querySelectorAll('.skills img') as NodeListOf<HTMLImageElement>

// targets.forEach(target => {
// })