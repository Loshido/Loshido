const innerHTML = `
<h2 class="whitespace-nowrap text-ellipsis overflow-hidden font-medium text-black">
    Voir plus
</h2>
<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:translate-x-2 transition-transform" 
    viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="black">
    <path d="m9 18 6-6-6-6"/>
</svg>`

export default function create(): HTMLAnchorElement {   
    const link = document.createElement('a')
    link.href = 'https://github.com/Loshido?tab=repositories'
    link.innerHTML = innerHTML
    link.className = 'rounded w-full sm:w-60 h-24 bg-black/5 p-5 flex flex-row gap-1' 
        + ' items-center hover:bg-black/10 cursor-pointer select-none group'

    return link
}
