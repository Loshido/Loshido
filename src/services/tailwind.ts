interface TailwindCliOptions {
    quiet?: boolean,
    watch?: boolean
}

export default async (options: TailwindCliOptions) => {
    const process = new Deno.Command('deno', {
        args: ['task', (options.watch ?? true) ? 'tailwind-dev' : 'tailwind'],
        stdout: options.quiet ? 'null' : 'inherit',
        stderr: options.quiet ? 'null' : 'inherit'
    }).spawn()

    await process.output()
}