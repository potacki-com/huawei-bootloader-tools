import { fastboot } from "./utils/const.mjs";
import { execWithString } from "./utils/exec.mjs";

export class Fastboot {
  /**
   * Executes a fastboot command.
   *
   * @param {string} command
   * @return {string} Command output
   */
  static async command(command = "help") {
    return await execWithString([fastboot, command].join(" "));
  }

  /**
   * Checks whether there is any devices detected by fastboot.
   *
   * @return {Promise<boolean>}
   */
  static async hasDevices() {
    const out = await Fastboot.command("devices");
    return out.trim().length >= 1;
  }

  /**
   * Returns a promise that resolves when at least
   * one device is detected by fastboot.
   *
   * This is similar to adb's wait-for-device command,
   * however fastboot does not have such command, so this is
   * an abstraction that checks for the output of the `devices` command.
   *
   * @return {Promise<void>}
   */
  static async waitForDevice() {
    if (!(await this.hasDevices())) {
      return await Fastboot.waitForDevice();
    }

    verboseLog("Fastboot.waitForDevice(): device detected, wait finished");
  }

  /**
   * Reboots the device and waits until it is detected by fastboot again.
   *
   * @return {Promise<void>}
   */
  static async rebootDevice(mode = "bootloader") {
    await Fastboot.command(["reboot", mode].join(" "));
    await Fastboot.waitForDevice();
  }

  static async isLocked() {
    return (await Fastboot.command("getvar unlocked")).trim().toLowerCase().includes("no");
  }

  static async isUnlocked() {
    return (await Fastboot.command("getvar unlocked")).trim().toLowerCase().includes("yes");
  }
}
