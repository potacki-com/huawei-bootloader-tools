import { readFileSync } from "fs";
import path from "path";
import { __root } from "./_const.mjs";

export const wait = (num) => new Promise((res) => setTimeout(() => res(), num));

export const args = process.argv.slice(2);

export const params = args
  .filter((arg) => arg.startsWith("--"))
  .map((param) => param.substring("--".length, param.length));

export const verbose = params.includes("verbose");

export const {
  imei,
  autorebootAfter = 4,
  throwOnUnknownErrors = false,
  saveStateAfter = 200,
} = JSON.parse(readFileSync(path.join(__root, "config.json"), "utf-8"));

export const verboseLog = (...args) => verbose && console.log(...args);
