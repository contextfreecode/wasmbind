async function main() {
  const module = await init();
  const message = "You need to escape <tags> & such.";
  console.log(module.escapeHtml(message));
}

async function init(): Promise<Module> {
  const path = "../target/wasm32-unknown-unknown/release/hand.wasm";
  const response = await fetch(new URL(path, import.meta.url));
  const buffer = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(buffer);
  return new Module(instance.exports as unknown as RawModule);
}

class Module {
  escapeHtml(text: string): string {
    const { raw } = this;
    const encoded = new TextEncoder().encode(text);
    const inSpanPtr = raw.alloc8(encoded.length);
    try {
      const { memory } = raw;
      const inView = new DataView(memory.buffer);
      const inPtr = inView.getUint32(inSpanPtr, true);
      // We already know the length.
      // const inLen = inputView.getUint32(inSpanPtr + 4, true);
      const inArray = new Uint8Array(memory.buffer);
      inArray.set(encoded, inPtr);
      const outSpanPtr = raw.escapeHtml(inPtr, encoded.length);
      try {
        // Memory may have resized, so access buffer fresh.
        const outView = new DataView(memory.buffer);
        const outPtr = outView.getUint32(outSpanPtr, true);
        const outLen = outView.getUint32(outSpanPtr + 4, true);
        const outArray = new Uint8Array(memory.buffer);
        const outSlice = outArray.slice(outPtr, outPtr + outLen);
        return new TextDecoder().decode(outSlice);
      } finally {
        raw.free8(outSpanPtr);
      }
    } finally {
      raw.free8(inSpanPtr);
    }
  }

  constructor(raw: RawModule) {
    this.raw = raw;
  }

  private raw: RawModule;
}

interface RawModule {
  alloc8(len: number): number;
  escapeHtml(ptr: number, len: number): number;
  free8(len: number);
  memory: WebAssembly.Memory;
}

await main();

export {};
