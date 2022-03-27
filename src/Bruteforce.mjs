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
import rl from "readline";
import { execWithString } from "./_exec.mjs";
import { fastbootMessages, adb, fastboot } from "./_const.mjs";
import {
  CodeNotFoundException,
  CommandInvalidException,
  UnknownOutputException,
} from "./_exceptions.mjs";
import {
  wait,
  imei,
  autorebootAfter,
  throwOnUnknownErrors,
  saveStateAfter,
  verboseLog,
} from "./_misc.mjs";
import { win } from "./_platform.mjs";

export class Bruteforce {
  attempt = 0;
  currentCode = 1000000000000000;
  lastSavedAttempt = 0;
  lastRebootAttempt = 0;

  constructor() {
    /**
     * If an exit signal is received, the last code is saved before
     * exiting the script.
     */

    // Windows workaround, cause fuck windows, fuck these mfs and their
    // bigass corporate offices, fucking bigots sitting with their asses shitting
    // out shit code more smelly than their disgusting armpits.
    let rline = null;
    if (win) {
      rline = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    }

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      if (rline) {
        console.log("readline fallback for winsmells");
        rline.on(signal, this.shutdownHandler.bind(this));
      }
      process.on(signal, this.shutdownHandler.bind(this));
    });
  }

  /**
   * Returns a last saved state if available, otherwise null is returned.
   *
   * @return {number|null}
   */
  static getLastSavedState() {
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
    await this.rebootDevice();

    this.currentCode = this.nextCode();
    await this.bruteforce();
  }

  shutdownHandler() {
    console.info("Signal received, saving last state.");

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
        await this.rebootDevice();
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
      throw new CodeNotFoundException("No combination found");
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
    const fastbootOutput = (await execWithString(`${fastboot} oem unlock ${code}`))
      .toLowerCase()
      .trim();

    console.log(fastbootOutput);

    if (fastbootOutput.includes(fastbootMessages.commandInvalid)) {
      throw new CommandInvalidException("fastboot does not recognize the unlock command.");
    }

    if (fastbootOutput.includes(fastbootMessages.oemUnlockFail)) {
      return false;
    }

    if (fastbootOutput.includes(fastbootMessages.oemSuccess)) {
      return true;
    }

    if (throwOnUnknownErrors) {
      throw new UnknownOutputException();
    }

    return false;
  }

  /**
   * Reboots the device into the selected mode.
   * Defaults to bootloader.
   *
   * @param {string} mode
   */
  static async rebootDevice(mode = "bootloader") {
    await execWithString(
      `${(await this.fastbootHasDevices()) ? fastboot : adb} reboot ${mode}`.trim(),
      process.stdout
    );
    await this.fastbootWaitForDevice();
  }

  static async fastbootHasDevices() {
    const out = await execWithString(`${fastboot} devices`);
    return out.trim().length >= 1;
  }

  static async fastbootWaitForDevice() {
    if (!(await this.fastbootHasDevices())) {
      return await this.fastbootWaitForDevice();
    }

    verboseLog("fastbootWaitForDevice(): wait finished");
  }

  static async adbWaitForDevice() {
    const out = (await execWithString(`${adb} wait-for-device`)).trim().toLowerCase();

    if (out.startsWith("error")) {
      verboseLog("adbWaitForDevice(): error occurred (can be ok):", out);
      verboseLog("adbWaitForDevice(): waiting for 5 seconds, then attempting again....");

      wait(5000);

      return await this.adbWaitForDevice();
    }

    verboseLog("adbWaitForDevice(): wait finished");
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
