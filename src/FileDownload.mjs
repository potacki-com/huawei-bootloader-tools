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

import fetch from "node-fetch";
import { createWriteStream, mkdirSync, ReadStream, WriteStream } from "fs";
import path from "path";

/**
 * Utility class for downloading files.
 *
 * @class
 */
export class FileDownload {
  /**
   * Creates a new HTTP request.
   *
   * @param {string|URL} url
   * @return {Promise<Response>}
   *
   * @private
   */
  static _createRequest(url) {
    if (!(url instanceof URL)) {
      try {
        url = new URL(url);
      } catch {
        throw new Error("invalid url");
      }
    }

    return fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0",
      },
    });
  }

  /**
   * Promisify stream piping.
   *
   * @param {ReadStream} from
   * @param {WriteStream} where
   * @return {Promise<void>}
   *
   * @private
   */
  static _pipe(from, where) {
    if (!from || !where) {
      throw new TypeError("from and where must be read/write streams.");
    }

    return new Promise((res, rej) => {
      const stream = from.pipe(where);

      stream.on("finish", () => {
        where.close();
        res();
      });

      stream.on("error", (e) => rej(e));
    });
  }

  /**
   * Downloads a file to a specified path.
   *
   * @param {string} url
   * @param {destination} string
   * @return {void}
   */
  static async downloadFile(url, destination) {
    if (!url || !destination) {
      throw new TypeError("url and destination must be a string.");
    }

    const request = this._createRequest(url);
    const response = await request;

    /**
     * Ensure the parents folders for the destination file exist.
     */
    mkdirSync(path.dirname(destination), { recursive: true });

    /**
     * Pipe the response stream into the new file stream.
     */
    await this._pipe(response.body, createWriteStream(destination));
  }
}
