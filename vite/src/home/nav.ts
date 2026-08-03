const main = document.querySelector('main') as HTMLElement
const nav = document.querySelector('nav') as HTMLElement

const dots = new Map<string, HTMLAnchorElement>()

const observer = new IntersectionObserver(entries => {
    for(const entry of entries) {
        const dot = dots.get(entry.target.id)
        if(!dot) continue

        dot.classList.toggle('bg-accent', entry.isIntersecting)
        dot.classList.toggle('bg-black/5', !entry.isIntersecting)
    }
}, {
    threshold: [0.5]
})

nav.innerHTML = ''
main.querySelectorAll('& > *').forEach(section => {
    const dot = document.createElement('a')

    dot.href = '#' + section.id
    dot.className = "w-2 h-2 sm:w-4 sm:h-4 hover:bg-black/25 rounded-full transition-colors"

    nav.appendChild(dot)
    dots.set(section.id, dot)

    observer.observe(section)
}) 