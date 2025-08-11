export default (signal?: AbortSignal) => {
    const cmd = new Deno.Command("deno", {
        args: ["task", "build"],
        signal,
        stdout: "inherit",
        stderr: "inherit",
        stdin: 'null'
    })


    const output = cmd.outputSync()
    return output.success
}