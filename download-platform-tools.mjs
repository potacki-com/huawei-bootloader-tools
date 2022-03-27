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

import path from "path";
import zip from "zip-local";
import { rmSync } from "fs";
import { FileDownload } from "./utils/_fileDownload.mjs";
import { platformTools, bin } from "./utils/_const.mjs";
import { platform } from "./utils/_platform.mjs";

const run = async () => {
  console.log(`downloading binaries for ${platform}...`);

  const downloadLink = platformTools[process.platform];
  const downloadFolder = path.join(bin, platform);

  const filePath = path.join(downloadFolder, "tools.zip");

  /**
   * Downloads the file to bin/{os}/tools.zip
   */
  console.log(`downloading platform tools (${downloadLink})...`);
  await FileDownload.downloadFile(downloadLink, filePath);

  /**
   * Unzips the platform tools.
   */
  console.log("unzipping contents...");
  zip.sync.unzip(filePath).save(downloadFolder);

  /**
   * Deletes the downloaded file.
   */
  console.log("cleaning up...");
  rmSync(filePath);
};

run();
