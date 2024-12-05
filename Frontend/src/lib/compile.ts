import wabt from 'wabt';
import { consoleOutput } from './console-output';
import { textEditorCode } from './text-editor-code';
import { currentCompiledWat } from './current-compiled-wat';

const moduleOptions = {
    env: {
        print_i32: (value: number) => {
            console.log(value);
            consoleOutput.update((old) => [...old, String(value)]);
        },
        print_f64: (value: number) => {
            console.log(value);
            consoleOutput.update((old) => [...old, String(value)]);
        }
    }
};


export async function compileBird(code: string) {
    const response = await fetch(`http://localhost:5174/compile-bird`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({ code })
    });

    if (response.status === 500) {
        const text = await response.text();
        console.log("TEXT RESPONSE", text.split("\n"));
        consoleOutput.update((old) => [...old, text]);
        return;
    }

    const buffer = await response.arrayBuffer();

    compileWasm(buffer);
}

export async function compileWat(code: string) {
    try {
        const wabtInterface = await wabt();
        const mod = wabtInterface.parseWat('test.wat', code);
        const buffer = mod.toBinary({ log: true }).buffer;
        const module = await WebAssembly.compile(buffer);
        const instance = new WebAssembly.Instance(module, moduleOptions);

        (instance.exports.main as () => void)();
    } catch (e) {
        consoleOutput.update((old) =>
            [...old, `${e}`]
        );
    }
}

export async function compileWasm(buffer: ArrayBuffer) {
    try {
        const wabtInterface = await wabt();
        const mod = wabtInterface.readWasm(new Uint8Array(buffer), { readDebugNames: true });
        const text = mod.toText({ foldExprs: true, inlineExport: true });

        currentCompiledWat.set(text);

        const module = await WebAssembly.compile(buffer);
        const instance = new WebAssembly.Instance(module, moduleOptions);

        (instance.exports.main as () => void)();
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
        const instance = new WebAssembly.Instance(module, moduleOptions);

        (instance.exports.main as () => void)();
    } catch (e) {
        console.log(e);
        consoleOutput.update((old) =>
            [...old, `${e}`]
        );
    }
}
