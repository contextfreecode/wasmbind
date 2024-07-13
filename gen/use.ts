async function main() {
  await init();
  const message = "You need to escape <tags> & such.";
  console.log(escapeHtml(message));
  // Use longer array for bigger allocation inside wasm.
  const longer = message.repeat(1000);
  const longerEscaped = escapeHtml(longer);
  console.log(`Length from ${longer.length} to ${longerEscaped.length}`);
}

import init, { escapeHtml } from "./pkg/gen.js";

await main();
