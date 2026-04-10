import load, { type Project } from "./load"

const response = await fetch('/projects.json')

if(!response.ok) throw "failed to load projects"
const projects = await response.json() as Project[]

const parent = document.getElementById('projects') as HTMLDivElement
const containers = new Array(...parent.querySelectorAll('div').values())

if(projects.length > containers.length) {
    const more = (await import('./more')).default()

    parent.appendChild(more)
    containers.splice(containers.length - 1, 1)[0]
        .remove()
} else {
    const to_delete = containers.length - projects.length

    containers.splice(containers.length - to_delete, to_delete)
        .forEach(container => container.remove())
}

containers.slice(0, Math.min(containers.length, projects.length)).forEach((container, i) => load(projects[i], container))