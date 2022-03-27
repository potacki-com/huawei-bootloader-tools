/**
 * Huawei Bootloader Utils by VottusCode
 * Set of scripts to help you with bootloader (un)locking.
 *
 * Warning: The author nor any contributors are responsible for any kind of damage
 * or loss of data that may encounter. You may use these scripts at your own risk.
 * Do not use unless you know what you're doing.
 *
 * Copyright (c) 2022 Mia Lilian Morningstar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { readFileSync } from "fs";
import path from "path";
import { __root } from "./_const.mjs";

export const wait = (num) => new Promise((res) => setTimeout(() => res(), num));

export const rawArgs = process.argv.slice(2);

export const args = rawArgs.filter((arg) => !arg.startsWith("--"));

export const params = rawArgs
  .filter((arg) => arg.startsWith("--"))
  .map((param) => param.substring("--".length, param.length));

export const verbose = params.includes("verbose");

export const skipWarning = params.includes("skip-warning");

export const {
  imei,
  autorebootAfter = 4,
  throwOnUnknownErrors = false,
  saveStateAfter = 200,
} = JSON.parse(readFileSync(path.join(__root, "config.json"), "utf-8"));

export const verboseLog = (...args) => verbose && console.log(...args);
