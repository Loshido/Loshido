import load from "./load"
import projects from "./projects.json"

const parent = document.getElementById('projects-container') as HTMLDivElement
parent.innerHTML = ''
projects.forEach(project => {
    const div = document.createElement('div')
    parent.append(div)
    load(project, div)
})