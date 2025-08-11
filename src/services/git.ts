const FETCH = 'git fetch origin production'
const CHECKOUT = 'git checkout production'
const RESET = 'git reset --hard origin/production'

export const checkout = (signal?: AbortSignal) => {
    
    const command = new Deno.Command(
        [FETCH, CHECKOUT, RESET].join(' && '),
        {
            stderr: "inherit",
            signal
        }
    )

    const output = command.outputSync()

    return output.success
}