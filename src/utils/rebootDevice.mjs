import { Adb } from "../Adb.mjs";
import { Fastboot } from "../Fastboot.mjs";

/**
 * Reboot a device using either adb or fastboot,
 * depending on which one detects the device.
 *
 * @param {string} mode
 * @return {Promise<boolean>}
 */
export const rebootDevice = async (mode = "bootloader") => {
  if (await Fastboot.hasDevices()) {
    return await Fastboot.rebootDevice(mode);
  }

  return await Adb.rebootDevice(mode);
};
