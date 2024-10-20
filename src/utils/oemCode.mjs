const args = process.argv.slice(2);

let oemCode = args[0] ? parseInt(args[0]) : null;

if (oemCode !== null && (isNaN(oemCode) || String(oemCode).length !== 16)) {
  console.error("Invalid OEM code specified.");
  throw new Error(`Correct command usage: node path/to/script.mjs <oem_code>`);
}

if (oemCode === null) {
  console.warn("OEM code not specified, proceeding without OEM code.");
}

export { oemCode };
