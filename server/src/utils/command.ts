import { spawn } from "child_process";

export const runCommand = (command: string, args: string[]) => new Promise<boolean>(
    (resolve, reject) => {
        const build = spawn(command, args);

        build.stdout.on("data", data => {
            console.log(data.toString());
        });

        build.stderr.on("data", data => {
            console.log(data.toString());
        });

        build.on("exit", code => {
            console.log(`${command} exited with code ${code}`);
            if (code === 0) {
                resolve(true);
            } else {
                reject();
            }
        });
    }
);