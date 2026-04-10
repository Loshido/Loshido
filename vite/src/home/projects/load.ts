const github = (href: string): HTMLAnchorElement => {
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.innerHTML = `<img src="/assets/github.svg" alt="Github" `
        + `width="12" height="12" draggable="false" class="w-3 h-3">`
    anchor.className = "w-5 h-5 p-1 hover:bg-black/10 rounded-full transition-colors"

    return anchor
}

const arrow = `
<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" 
    stroke-width="2" fill="none" stroke="black">
    <path d="m9 18 6-6-6-6"/>
</svg>`

const more = (href: string): HTMLAnchorElement => {
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.innerHTML = arrow
    anchor.className = "w-5 h-5 p-1 hover:pl-3 transition-all hover:w-7 hover:bg-black/10 rounded-full"

    return anchor
}

const innerHTML = `
<h2 class="whitespace-nowrap text-ellipsis overflow-hidden font-medium"></h2>
<p class="text-ellipsis overflow-hidden font-light text-xs line-clamp-2"></p>
<div class="details text-xs font-light flex flex-row items-center justify-start gap-1 mt-0.5">
    <div class="text-black/50"></div>
</div>`

export interface Project {
    title: string,
    description: string
    date?: string
    github?: string,
    more?: string,
}

export default function load(project: Project, div: HTMLDivElement) {
    div.className = 'rounded w-full sm:w-60 h-24 bg-black/5 p-3'
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