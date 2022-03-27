# Huawei Bootloader Tools

This repository contains a set of scripts that can help you (un)lock the bootloader.

## Disclaimer

Everything you do with these scripts you do at your own risk. Me nor the contributors are responsible
for any damage that may occur. Please go away if you don't know what you're doing.

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

## Running the scripts

Please make sure that the device is connected already. It doesn't matter whether it's in fastboot mode
or not.

### Unlock bootloader

````
node unlock-bootloader.mjs
```
````

<hr>

2022 &copy; Mia Lilian Morningstar &ndash; Available under the MIT license, see [LICENSE](LICENSE).
