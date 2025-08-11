export const checkout = (signal?: AbortSignal) => {
    const fetch = new Deno.Command('git', {
        args: ['fetch', 'origin', 'production'],
        stderr: "inherit",
        stdout: "null",
        signal
    })
    const fetched = fetch.outputSync().success
    if(!fetched) return false

    const checkout = new Deno.Command('git', {
        args: ['checkout', 'production'],
        stderr: "inherit",
        stdout: "null",
        signal
    })
    const checked = checkout.outputSync().success
    if(!checked) return false

    const reset = new Deno.Command('git', {
        args: ['reset', '--hard', 'origin/production'],
        stderr: "inherit",
        stdout: "null",
        signal
    })
    const hasReset = reset.outputSync().success
    if(!hasReset) return false

    return true
}