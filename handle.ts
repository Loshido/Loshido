let status = 1;

while(status) {
    const server = new Deno.Command("deno", {
        args: [
            "run",
            "--env-file=.env",
            "--allow-net",
            "--allow-read",
            "--allow-ffi", 
            "--allow-env",
            "--allow-run",
            "./dist/server/entry.mjs"
        ],
        stderr: "inherit",
        stdout: "inherit",
        stdin: "null",
    })
    
    const code = server.outputSync()
    if(code.code !== 2) {
        status = 0;
        break;
    }
}
