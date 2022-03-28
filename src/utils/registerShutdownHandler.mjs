import { win } from "./platform.mjs";
import rl from "readline";

/**
 * Register a shutdown handler.
 *
 * The registered shutdown handler will get called
 * when Ctrl+C is pressed (SIGINT/SIGTERM)
 *
 * @param {*} shutdownHandler
 */
export const registerShutdownHandler = (shutdownHandler) => {
  // Windows workaround, cause fuck windows, fuck these mfs and their
  // bigass corporate offices, fucking bigots sitting with their asses shitting
  // out shit code more smelly than their disgusting armpits.
  let rline = null;
  if (win) {
    rline = rl.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    if (rline) {
      console.log("readline fallback for winsmells");
      rline.on(signal, shutdownHandler);
    }
    process.on(signal, shutdownHandler);
  });
};
