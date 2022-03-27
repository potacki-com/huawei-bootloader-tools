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

export const platformTools = {
  win32: "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
  linux: "https://dl.google.com/android/repository/platform-tools-latest-linux.zip",
  darwin: "https://dl.google.com/android/repository/platform-tools-latest-darwin.zip",
};

let platform = process.platform;

/**
 * Checks the compatibility by makign sure there is a download link
 * for the OS running this script.
 *
 * If not, it shows a warning message and defaults to linux.
 */
if (!Object.keys(platformTools).includes(platform)) {
  console.warn(
    "You are running on an unsupported OS. You may encounter issues with this script.\n" +
      "Linux binaries will be used.\n\n"
  );

  platform = "linux";
}

export const win = platform === "win32";
export const linux = platform === "linux";
export const darwin = platform === "darwin";

export { platform };
