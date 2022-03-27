import { execWithOut } from "better-exec";

export * from "better-exec";

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
