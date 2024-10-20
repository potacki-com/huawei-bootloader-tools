import { writeFileSync } from "fs";
import { Fastboot } from "./Fastboot.mjs";
import { fastbootMessages } from "./utils/const.mjs";
import { imei, logEnable, throwOnUnknownErrors } from "./utils/misc.mjs";

export class Bootloader {
  /**
   * Send an fastboot oem command
   *
   * @param {*} command
   * @return {boolean} Success
   *
   * @private
   */
  static async _sendOemCommand(command) {
    const fastbootOutput = (await Fastboot.command(`oem ${command}`)).toLowerCase().trim();
    if (logEnable) {
      writeFileSync(`log_${imei}.txt`, `fastboot ${command} :\n ${fastbootOutput} \n`, { flag: 'a' });
    }
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
   * Unlocks the device's bootloader.
   *
   * Returns true if it was successful,
   * otherwise it returns false (eg. invalid code)
   *
   * @param {string} code
   * @return {Promise<boolean>}
   */
  static async unlock(code) {
    return await this._sendOemCommand(`unlock ${code}`);
  }

  /**
   * Locks the device's bootloader.
   *
   * Returns true if it was successful,
   * otherwise it returns false (eg. invalid code)
   *
   * @param {string} code
   * @return {Promise<boolean>}
   */
  static async relock(code) {
    return await this._sendOemCommand(`relock ${code}`);
  }
}
