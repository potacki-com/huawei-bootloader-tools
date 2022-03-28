let oemCode = parseInt(args[0]);

if (!oemCode || oemCode === NaN || String(oemCode).length !== 16) {
  console.error("Invalid OEM code specified.");
  throw new Error(`Correct command usage: node path/to/script.mjs <oem_code>`);
}

export { oemCode };
