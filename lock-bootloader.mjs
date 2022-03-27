import { fileURLToPath } from "url";
import { Bruteforce } from "./src/Bruteforce.mjs";
import { args, skipWarning, wait } from "./src/_misc.mjs";
import { execWithString } from "./src/_exec.mjs";
import { fastbootMessages, fastboot } from "./src/_const.mjs";
import path from "path";

const scriptName = path.basename(fileURLToPath(import.meta.url));

const run = async () => {
  if (!skipWarning) {
    console.log(
      [
        "",
        "This script locks your device's bootloader, restricting you from ability",
        "to customize your android device. This is usually done when the device is serviced,",
        "given or sold to someone else.",
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

  console.log("Lock Bootloader - github.com/VottusCode/huawei-honor-bootloader-bruteforce\n");

  let oemCode = parseInt(args[0]);

  if (!oemCode || oemCode === NaN || String(oemCode).length !== 16) {
    console.error("Invalid OEM code specified.");
    console.log(`Correct command usage: node ${scriptName} <oem_code>`);
    return;
  }

  // Using methods from the unlock script
  // to reduce duplicating code.
  if (!(await Bruteforce.fastbootHasDevices())) {
    await Bruteforce.rebootDevice();
  }

  if ((await execWithString(`${fastboot} getvar unlocked`)).trim().toLowerCase().includes("no")) {
    console.log(
      `The device is already locked. Are you sure you didn't want to run unlock-bootloader.mjs instead?`
    );
  }

  const output = await execWithString(`${fastboot} oem relock ${oemCode}`);

  console.log(output);

  if (output.trim().toLowerCase().includes(fastbootMessages.oemSuccess)) {
    console.log("The lock was successful.");
    console.log("fastboot getvar unlocked ->", await execWithString(`${fastboot} getvar unlocked`));

    console.log("Rebooting deivce...");
    await Bruteforce.rebootDevice("");
  }
};

run();
