import { platform, win } from "./_platform.mjs";
import path from "path";
import { __root } from "./_const.mjs";

export const adb = path.join(__root, "bin", platform, "platform-tools", win ? "adb.exe" : "adb");

export const fastboot = path.join(__root, "bin", platform, "platform-tools", win ? "fastboot.exe" : "fastboot");
