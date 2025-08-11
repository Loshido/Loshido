export default (signal?: AbortSignal) => {
    const cmd = new Deno.Command("deno", {
        args: ["task", "build"],
        signal,
        stdout: "null",
        stderr: "inherit",
        stdin: "null"
    })


    const output = cmd.outputSync()
    return output.success
}