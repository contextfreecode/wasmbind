async function main() {
  await init();
  const message = "You need to escape <tags> & such.";
  console.log(escapeHtml(message));
}

import init, { escapeHtml } from "./pkg/gen.js";

await main();
