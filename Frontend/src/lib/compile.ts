import wabt from 'wabt';
import { consoleOutput } from './console-output';
import { textEditorCode } from './text-editor-code';


export async function compileBird(code: string) {
    console.log("foo");
    const response = await fetch(`http://localhost:5174/compile-bird`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({ code })
    });
    console.log("response", response);

    const buffer = await response.arrayBuffer();
    console.log("buffer", buffer);

    compileWasm(buffer);
}

export async function compileWat(code: string) {
    try {
        const wabtInterface = await wabt();
        const mod = wabtInterface.parseWat('test.wat', code);
        const buffer = mod.toBinary({ log: true }).buffer;
        const module = await WebAssembly.compile(buffer);
        const instance = new WebAssembly.Instance(module, {
            env: {
                print: (value: any) => {
                    console.log(value);
                    consoleOutput.update((old) => [...old, value]);
                }
            }
        });

        (instance.exports.main as Function)();
    } catch (e) {
        consoleOutput.update((old) =>
            [...old, `${e}`]
        );
    }
}

export async function compileWasm(buffer: ArrayBuffer) {
    try {
        const module = await WebAssembly.compile(buffer);
        const instance = new WebAssembly.Instance(module, {
            env: {
                print: (value: any) => {
                    console.log(value);
                    consoleOutput.update((old) => [...old, value]);
                }
            }
        });

        (instance.exports.main as Function)();
    } catch (e) {
        consoleOutput.update((old) =>
            [...old, `${e}`]
        );
    }
}

export async function uploadBird(code: string) {
    textEditorCode.update(() => code);

    compileBird(code);
}

export async function uploadWasm(code: Uint8Array | ArrayBuffer) {
    try {
        const wabtInterface = await wabt();
        const mod = wabtInterface.readWasm(new Uint8Array(code), { readDebugNames: true });
        textEditorCode.update(() => mod.toText({ foldExprs: true, inlineExport: true }));

        const module = await WebAssembly.compile(code);
        const instance = new WebAssembly.Instance(module, {
            env: {
                print: (value: any) => {
                    console.log(value);
                    consoleOutput.update((old) => [...old, value]);
                }
            }
        });

        (instance.exports.main as Function)();
    } catch (e) {
        console.log(e);
        consoleOutput.update((old) =>
            [...old, `${e}`]
        );
    }
}
