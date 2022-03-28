import path from "path";
import { fileURLToPath } from "url";
import { Fastboot } from "../src/Fastboot.mjs";
import { skipWarning, wait, rebootDevice, args } from "../src/utils/index.mjs";

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

  await rebootDevice("bootloader");

  if (await Fastboot.isLocked()) {
    console.log(
      `The device is already locked. Are you sure you didn't want to run unlock-bootloader.mjs instead?`
    );
  }

  const output = await Fastboot.command(`oem relock ${oemCode}`);
  console.log(output);

  if (output.trim().toLowerCase().includes(fastbootMessages.oemSuccess)) {
    console.log("The lock was successful.");
    console.log("fastboot getvar unlocked ->", await Fastboot.command("getvar unlocked"));

    console.log("Rebooting deivce...");
    await rebootDevice();
  }
};

run();
