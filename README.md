# Disclaimer

Everything you do with these scripts you do at your own risk. Me nor the contributors are responsible
for any damage that may occur. Please go away if you don't know what you're doing.

# Huawei Bootloader Tools

This repository contains a set of scripts that can help you (un)lock the bootloader.

### Success rate

The success rate depends on the region where you bought the device. You will have most luck with devices
bought in Europe, as they only contain numbers in their bootloader unlock code. You can try with other regions
as well, but you have way smaller chance of succeeding.

### Tested devices

- Huawei P20 lite (ANE-LX1)
  - State: In progress
  - Started at: March 27th 2022, 17:04
  - Notes:
    - requires `autorebootAfter` to be set to `4`

Other devices which have been tested with the original Python script:

(see: [SkyEmie/huawei-honor-unlock-bootloader#summary](https://github.com/SkyEmie/huawei-honor-unlock-bootloader#summary))

- Honor 5x, 8x, 9x
- Honor view 10 and 20
- Honor 10 lite
- Huawei P20 lite
- Huawei Y6 2019
- Huawei P30

## Requirements

- EMUI 9 or lower

  Unfortunetely, with EMUI 10 and later the `oem unlock` command required for bootloader unlocking has been removed by Huawei, meaning
  that there is no way for consumers to unlock their device, regardless of whether they do have the code or not.

- USB Cable

  To connect the device to your computer

- Internet connection (optional)

  The latest platform tools (containing fastboot and adb required by this script) are downloaded using the `download-platform-tools.mjs` script which required internet connection. To manually include these scripts, put the binaries into {directory_with_scripts}/bin/{distro - win32/linux/darwin}/platform-tools/

- Node.js 14 or later (older are not tested)

  These scripts are written in JavaScript which require Node.js to run.
  You can download it here: https://nodejs.org/en/

## OS Support

The scripts are written to support all operating systems, however if the device is not detected, additional drivers may be necessary.

## Configuration

Before running any (un)locking scripts, you must create a config.json file and fill it out.
Do so by renaming `config.example.json` to `config.json` and fill out everything to your needs.

`imei` (number) - IMEI of your device. You may find it in your device's settings or on your phone's box.

`autorebootAfter` (number) - How many attempts until the device will be automatically restarted. Most Huawei/Honor devices also have a protection which restarts the phone after few attempts. This would significantly slow down the process and would require your intervention. It's recommended to try without this option (remove this field from the config) and see if such behavior occurs. If so, set it to 1 less than the amount of attempts that trigger the restart (eg. restart after 5 seconds - set to 4 - this is the most usual).

`saveStateAfter` (number) - How many attempts until the current state (last attempted number) is saved. In case
the script gets interrupted, it can recover from the last saved state. Do not set this number too lower to prevent damaging/wearing out your computer's drive.

`throwOnUnknownErrors` (boolean) - If an unexpected output from adb/fastboot is received, should the script throw an error (= end)? Usually, this is set to false, but in some cases it might be usefull.

### Recommended configuration

```json
{
  "imei": xxxxxxxxxxxxxxx,
  "autorebootAfter": 4,
  "throwOnUnknownErrors": false,
  "saveStateAfter": 200
}
```

## Before running the scripts

Before running the scripts for the first time, make sure to read through these steps:

### Installing dependencies

You need to install all dependencies by the scripts so everything works as intended (or at all).

You can do that by running this command (Node.js is required):

```shell
$ npm install
```

### Downloading Platform tools

For using the (un)lock scripts, you must run the `download-platform-tools.mjs` script first.

```shell
$ node download-platform-tools.mjs
```

Alternatively, if you're not connected to the internet but have platform tools downloaded, you may
place them here: `{directory_with_scripts}/bin/{distro - win32/linux/darwin}/platform-tools/`

### Setting platform tools as executable (Linux/macOS)

You will only need `adb` and `fastboot`:

```
chmod +x bin/{distro - win32/linux/darwin}/platform-tools/adb
chmod +x bin/{distro - win32/linux/darwin}/platform-tools/fastboot
```

### Enabling USB debugging

First, you need to go to Settings > Developer options (not enable by default, to enable,
go to `About phone` and tap the `Build number` field 7 times, then go back and it should appear)
and enable `USB Debugging` and `OEM unlocking`. Then, connect your device to the computer
(if it's not already) and it will ask you to allow usb/adb debugging. Allow it and make sure
to check `Always allow from this computer`.

## Running the scripts

Please make sure that the device is connected already. It doesn't matter
whether if it's in fastboot/bootloader mode or not.

### Bruteforce bootloader

You can run this script by using this command:

```shell
$ node scripts/bruteforce-bootloader.mjs
```

It takes a lot of time as the script attempts to bruteforce the code (= attempts lots of combinations). This will take ~~hours~~ days, depends purely on your luck.

**Warning:** When the correct code is found, the phone is instantly unlocked, which means that
all your data will be **ERASED**. Sometimes the device may prompt you before unlocking the phone,
however make sure to back up your data regardless.

### Lock bootloader

You can run this script by using this command:

```shell
$ node scripts/lock-bootloader.mjs <oem_code>
```

This takes usually just few seconds. After that, your device will reboot.

### Unlock bootloader

You can run this script by using this command:

```shell
$ node scripts/unlock-bootloader.mjs <oem_code>
```

This takes usually just few seconds. After that, your device will reboot.

### Download Platform tools

You can run this script by using this command:

```shell
$ node scripts/download-platform-tools.mjs
```

The platform tools are downloaded into the bin/{os}/platform-tools folder.

# Credits

[SkyEmie/huawei-honor-unlock-bootloader](https://github.com/SkyEmie/huawei-honor-unlock-bootloader) - The original Python script from which this project has been forked and rewritten.

<br>
<hr>

2022 &copy; Mia Lilian Morningstar &ndash; Available under the MIT license, see [LICENSE](LICENSE).
