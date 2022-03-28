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

import { Bruteforce } from "../src/Bruteforce.mjs";
import { wait, skipWarning } from "../src/utils/index.mjs";

const run = async () => {
  if (!skipWarning) {
    console.log(
      [
        "",
        "This script unlocks your deivce's bootloader by bruteforcing the unlock code.",
        "Unlocked bootloader can be used for rooting, flashing custom ROMs, etc.",
        "",
        "Authors of this script are not responsible for any kind of damage that may occur",
        "by using this script - run at your own risk.",
        "",
        "Only connect one device at a time, otherwise this script will not work properly.",
        "",
        "This script will start in 10 seconds - if you don't want to continue, press Ctrl+C.",
        "",
      ].join("\n")
    );

    await wait(10000);
  }

  console.log(
    "Unlock Bootloader (bruteforce) - github.com/VottusCode/huawei-honor-bootloader-bruteforce\n"
  );
  await new Bruteforce().start();
};

run();
