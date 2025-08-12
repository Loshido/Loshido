import { checkout } from "./git.ts"
import rebuild from "./rebuild.ts"

// exits the programm if success
export default (initiator: string, signal?: AbortSignal) => {
    const time = new Date().toLocaleTimeString('fr-FR', { timeStyle: 'medium' })
    console.log(`%c${time}%c Update %cinitiated%c by ${initiator}`, 'color: #0004', 'color: #fff', 'color: #70ffaf', 'color: #fff')
    
    const updated = checkout(signal)
    if(!updated) return 'failed to checkout'
    
    const rebuilt = rebuild(signal)
    if(!rebuilt) return 'failed to rebuild'

    console.info('Checkout & Rebuilt %csuccessfully', "color: #70ffaf")

    setTimeout(() => {
        Deno.exit(2)
    }, 1000)

    return 'ok'
}