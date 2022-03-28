import { Bootloader } from "../src/Bootloader.mjs";
import { Fastboot } from "../src/Fastboot.mjs";
import { skipWarning, wait, rebootDevice, oemCode } from "../src/utils/index.mjs";

const run = async () => {
  if (!skipWarning) {
    console.log(
      [
        "",
        "This script unlocks your device's bootloader which can be used for rooting,",
        "flashing custom ROMs, etc.",
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

  console.log("Unlock Bootloader - github.com/VottusCode/huawei-honor-bootloader-bruteforce\n");

  await rebootDevice("bootloader");

  if (await Fastboot.isUnlocked()) {
    console.log(
      `The device is already unlocked. Are you sure you didn't want to run lock-bootloader.mjs instead?`
    );
  }

  const unlock = await Bootloader.unlock(oemCode);

  if (!unlock) {
    console.log("The unlock process has failed. Please try locking manually.");
    return;
  }

  console.log("The unlock was successful.");
  console.log("fastboot getvar unlocked ->", await Fastboot.command("getvar unlocked"));

  console.log("Rebooting deivce...");
  await rebootDevice();
};

run();
