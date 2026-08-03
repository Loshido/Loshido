const github = (href: string): HTMLAnchorElement => {
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.target = "_blank"
    anchor.innerHTML = `<img src="/assets/github.svg" alt="Github" `
        + `width="14" height="14" draggable="false" class="w-4 h-4">`
    anchor.className = "w-6 h-6 p-1 hover:bg-black/10 rounded-full transition-colors"

    return anchor
}

const arrow = `
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" 
    stroke-width="2" fill="none" stroke="black">
    <path d="m9 18 6-6-6-6"/>
</svg>`

const more = (href: string): HTMLAnchorElement => {
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.innerHTML = arrow
    anchor.target = "_blank"
    anchor.className = "w-6 h-6 p-1 hover:pl-4 transition-all hover:w-8 hover:bg-black/10 rounded-full"

    return anchor
}

const innerHTML = `
<h2 class="whitespace-nowrap text-ellipsis overflow-hidden font-medium text-lg"></h2>
<p class="text-ellipsis overflow-hidden font-light text-sm line-clamp-2"></p>
<div class="details text-sm font-light flex flex-row items-center justify-start gap-1 absolute bottom-3 left-3">
    <div class="text-black/75 uppercase text-xs font-medium"></div>
</div>`

export interface Project {
    title: string,
    description: string
    date?: string
    github?: string,
    more?: string,
}

export default function load(project: Project, div: HTMLDivElement) {
    div.className = 'w-full sm:w-80 h-32 bg-black/5 border-2 border-black/25 border-dashed p-3 loaded'
    div.innerHTML = innerHTML

    const title = div.querySelector('h2') as HTMLHeadingElement
    title.innerText = project.title

    const desc = div.querySelector('p') as HTMLParagraphElement
    desc.innerText = project.description

    if(project.date) {
        const date = div.querySelector('.details > div') as HTMLDivElement
        date.innerText = project.date
    }

    if(project.github) {
        const node = github(project.github)
        const parent = div.querySelector('.details') as HTMLDivElement
        parent.appendChild(node)
    }
    if(project.more) {
        const node = more(project.more)
        const parent = div.querySelector('.details') as HTMLDivElement
        parent.appendChild(node)
    }
}