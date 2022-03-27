import { ChildProcess, exec as _exec } from "child_process";
import internal from "stream";

export const execStream = (cmd) => {
  const stream = _exec(cmd);
  if (!stream.stdout) throw new Error("There's no stdout.");

  return stream;
};

export const exec = (cmd, pipeStdout = null) =>
  new Promise((resolve, reject) => {
    const stream = execStream(cmd);

    if (pipeStdout) stream.stdout.pipe(pipeStdout);

    stream.stdout.on("error", reject);
    stream.stdout.on("end", resolve);
  });

export const execWithOut = (cmd, lineCb) =>
  new Promise((resolve, reject) => {
    const stream = execStream(cmd);

    stream.stdout.on("data", lineCb);
    stream.stdout.on("error", reject);
    stream.stdout.on("end", resolve);

    stream.stderr.on("data", lineCb);
    stream.stderr.on("error", reject);
  });

/**
 * @param {string}
 * @return {Promise<string>}
 */
export const execWithString = async (cmd) => {
  let str = "";

  await execWithOut(cmd, (line) => {
    str += line;
  });

  return str;
};
