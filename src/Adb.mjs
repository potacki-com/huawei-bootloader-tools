import { adb, execWithString } from "./utils/index.mjs";

export class Adb {
  /**
   * Executes an adb command.
   *
   * @param {string} command
   * @return {string} Command output
   */
  static async command(command = "help") {
    return (await execWithString([adb, command].join(" ")))
      .replace(/\* daemon not running; starting now at (.*)/g, "")
      .replace("* daemon started successfully", "");
  }

  /**
   * Checks whether there is any devices detected by adb.
   *
   * @return {Promise<boolean>}
   */
  static async hasDevices() {
    const out = await Adb.command("devices");
    return out.trim().length - "List of devices attached".length >= 1;
  }

  /**
   * Returns a promise that resolves when at least
   * one device is detected by adb.
   *
   * @return {Promise<void>}
   */
  static async waitForDevice() {
    const out = (await Adb.command("wait-for-device")).trim().toLowerCase();

    if (out.startsWith("error")) {
      verboseLog("Adb.waitForDevice(): error occurred (can be ok):", out);
      verboseLog("Adb.waitForDevice(): waiting for 5 seconds, then attempting again....");

      wait(5000);

      return await this.adbWaitForDevice();
    }
  }

  /**
   * Reboots the device and waits until it is detected by adb again.
   *
   * @return {Promise<void>}
   */
  static async rebootDevice(mode = "bootloader") {
    await Adb.command(["reboot", mode].join(" "));
    await Adb.waitForDevice();
  }
}
