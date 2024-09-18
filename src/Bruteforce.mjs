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

import { readFileSync, writeFileSync } from "fs";
import { Bootloader } from "./Bootloader.mjs";
import { registerShutdownHandler } from "./utils/registerShutdownHandler.mjs";
import { rebootDevice } from "./utils/rebootDevice.mjs";
import { imei } from "./utils/misc.mjs";
import { autorebootAfter } from "./utils/misc.mjs";
import { saveStateAfter } from "./utils/misc.mjs";
import { verboseLog } from "./utils/misc.mjs";

export class Bruteforce {
  attempt = 0;
  currentCode = 1000000000000000;
  lastSavedAttempt = 0;
  lastRebootAttempt = 0;

  constructor() {
    registerShutdownHandler(this.shutdownHandler.bind(this));
  }

  /**
   * Returns a last saved state if available, otherwise null is returned.
   *
   * @return {number|null}
   */
  getLastSavedState() {
    try {
      const content = readFileSync(`saved_state_${imei}.txt`, "utf-8");
      if (!content || content.trim() <= 0) return null;

      verboseLog("getLastSavedState(): found saved state, content:", content);
      return Number(content);
    } catch {
      return null;
    }
  }

  /**
   * Starts the bruteforcing process.
   */
  async start() {
    verboseLog("start(): called");

    this.attempt = 0;
    this.currentCode = this.getLastSavedState() ?? 1000000000000000;

    /**
     * Boot the device into bootloader mode. If the device
     * is already in bootloader mode, it reboots it again, just in
     * case there were already unlock attempts made (for devices without such
     * protection it's not necessary, but it doesn't take much time).
     */
    await rebootDevice("bootloader");

    this.currentCode = this.nextCode();
    await this.bruteforce();
  }

  /**
   * If an exit signal is received, the last code is saved before
   * exiting the script.
   */
  shutdownHandler() {
    console.info("Exit signal received, saving last state.");

    this.saveLastState(this.currentCode);
    process.exit();
  }

  /**
   * This is a recursive function that runs itself until
   * it finds the code. It is the heart of this whole script.
   *
   * @return {Promise<number>}
   */
  async bruteforce() {
    this.attempt++;

    console.log("\nattempt:", this.attempt, "code:", this.currentCode);
    const result = await this.attemptCode(this.currentCode);

    /**
     * If true is returned, the current code is the correct unlock code.
     * It's printed out, saved and returned and the recursion ends.
     */
    if (result) {
      console.log("Success! The code is:", result);
      this.saveBootloaderCode(this.currentCode);
      return this.currentCode;
    }

    /**
     * If enabled, the device is automatically rebooted every X attempts.
     * This is useful for devices that reboot every 5 attempts as a protection.
     */
    if (autorebootAfter) {
      if (this.attempt - this.lastRebootAttempt >= autorebootAfter) {
        this.lastRebootAttempt = this.attempt;

        console.log("autoreboot after", autorebootAfter, "attempts");
        await rebootDevice("bootloader");
      }
    }

    /**
     * If enabled, the last attempted code is saved every X attempts
     * in case the script is interrupted.
     *
     * Should not be set too low to prevent wearout of the drive.
     */
    if (saveStateAfter) {
      if (this.attempt - this.lastSavedAttempt >= saveStateAfter - 1) {
        this.lastSavedAttempt = this.attempt;
        this.saveLastState(this.currentCode);
      }
    }

    /**
     * Creates the next code and runs this function again.
     */
    this.currentCode = this.nextCode();

    /**
     * At this point no OEM code was found because all combinations
     * were tried and the next one would be too big.
     */
    if (this.currentCode >= 10000000000000000) {
      throw "Diocan";
    }

    return await this.bruteforce();
  }

  // todo: tbd
  nextCode() {
    const nextCode = Math.round(
      Number(String(this.currentCode + Math.sqrt(imei) * 1024).padStart(16, "0"))
    );
    verboseLog("nextCode(): next code is:", nextCode);

    return nextCode;
  }

  /**
   * Attempts to use a specified code on the device.
   *
   * @param {number} code
   * @throws {CommandInvalidException}
   * @throws {UnknownOutputException}
   * @return {Promise<boolean>}
   */
  async attemptCode(code) {
    return await Bootloader.unlock(code);
  }

  /**
   * Saves the bootloader code into a file.
   * The file name is code_{imei}.txt
   *
   * @param {number} code
   */
  async saveBootloaderCode(code) {
    verboseLog(`saveBootloaderCode(${code}): called, imei: ${imei}`);

    writeFileSync(
      `code_${imei}.txt`,
      `The bootloader code for the device with IMEI ${imei} is: ${code}`
    );
  }

  /**
   * Saves the last state.
   * The file name is saved_state_{imei}.txt
   *
   * @param {number} code
   */
  async saveLastState(code) {
    verboseLog(`saveLastState(${code}): called, imei: ${imei}`);

    writeFileSync(`saved_state_${imei}.txt`, String(code));
  }
}
