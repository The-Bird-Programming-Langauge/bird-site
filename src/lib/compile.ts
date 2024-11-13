import wabt from 'wabt';


export async function compileWat(code: string) {
    const wabtInterface = await wabt();
    const mod = wabtInterface.parseWat('test.wat', code);
    const buffer = mod.toBinary({ log: true }).buffer;
    const module = await WebAssembly.compile(buffer);
    const instance = new WebAssembly.Instance(module, {
        env: {
            print: (value: any) => {
                console.log(value);
            }
        }
    });

    (instance.exports.main as Function)();
}

export async function compileWasm(code: Uint8Array | ArrayBuffer) {
    const module = await WebAssembly.compile(code);
    const instance = new WebAssembly.Instance(module, {
        env: {
            print: (value: any) => {
                console.log(value);
            }
        }
    });

    (instance.exports.main as Function)();
}