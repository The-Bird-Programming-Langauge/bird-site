import wabt from 'wabt';
import { consoleOutput } from './console-output';
import { textEditorCode } from './text-editor-code';
import { currentCompiledWat } from './current-compiled-wat';

let instance: WebAssembly.Instance;
let memory: DataView<ArrayBuffer>;

const HEAD_PTR_OFFSET = 1;
const BLOCK_SIZE_OFFSET = 0;
const BLOCK_PTR_OFFSET = 4;
const BLOCK_MARK_OFFSET = 8;
const BLOCK_HEADER_SIZE = 9;
const FREE_LIST_START = 5;

export async function compileBird(code: string) {
    const response = await fetch(`http://localhost:5172/compile-bird`, {
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
        const wasmInstance = new WebAssembly.Instance(module, moduleOptions);
        instance = wasmInstance;
        memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);

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
        const wasmInstance = new WebAssembly.Instance(module, moduleOptions);
        instance = wasmInstance;
        memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);

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
        const wasmInstance = new WebAssembly.Instance(module, moduleOptions);
        instance = wasmInstance;
        memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);

        (instance.exports.main as () => void)();
    } catch (e) {
        console.log(e);
        consoleOutput.update((old) =>
            [...old, `${e}`]
        );
    }
}

function get_free_list_head_ptr() {
    return memory.getUint32(HEAD_PTR_OFFSET);
}

function get_block_size(ptr: number) {
    return memory.getUint32(ptr + BLOCK_SIZE_OFFSET);
}

function get_block_next_ptr(ptr: number) {
    return memory.getUint32(ptr + BLOCK_PTR_OFFSET);
}

function set_block_size(ptr: number, size: number) {
    memory.setUint32(ptr + BLOCK_SIZE_OFFSET, size);
}

function set_block_next_ptr(ptr: number, next_ptr: number) {
    memory.setUint32(ptr + BLOCK_PTR_OFFSET, next_ptr);
}

function set_block_mark(ptr: number, mark: number) {
    memory.setUint8(ptr + BLOCK_MARK_OFFSET, mark);
}

function set_free_list_head_ptr(ptr: number) {
    memory.setUint32(HEAD_PTR_OFFSET, ptr);
}


const moduleOptions = {
    env: {
        print_i32: (value: number) => {
            console.log(value);
            consoleOutput.update((old) => [...old, String(value)]);
        },
        print_f64: (value: number) => {
            console.log(value);
            consoleOutput.update((old) => [...old, String(value)]);
        },
        print_str: (ptr: number) => {
            const buffer = new Uint8Array((instance.exports.memory as WebAssembly.Memory).buffer);
            let str = "";
            for (let i = ptr; buffer[i] !== 0; i++) {
                str += String.fromCharCode(buffer[i]);
            }
            console.log(str);
            consoleOutput.update((old) => [...old, str]);
        },
        mem_get_32: (ptr: number, byte_offset: number) => {
            return memory.getUint32(ptr + BLOCK_HEADER_SIZE + 1 + byte_offset);
        },

        mem_get_64: (ptr: number, byte_offset: number) => {
            return memory.getFloat64(ptr + BLOCK_HEADER_SIZE + 1 + byte_offset);
        },
        /**
         * The first byte of the pointer is used to store the pointer bit 
         * 
         */
        mem_set_32: (ptr: number, offset: number, value: number) => {
            memory.setUint8(ptr + BLOCK_HEADER_SIZE + offset, 0);
            memory.setUint32(ptr + BLOCK_HEADER_SIZE + offset + 1, value);
        },
        mem_set_64: (ptr: number, offset: number, value: number) => {
            memory.setUint8(ptr + BLOCK_HEADER_SIZE + offset, 0b10);
            memory.setFloat64(ptr + BLOCK_HEADER_SIZE + offset + 1, value);
        },
        mem_set_ptr: (ptr: number, offset: number, value: number) => {
            memory.setUint8(ptr + BLOCK_HEADER_SIZE + offset, 0b01);
            memory.setUint32(ptr + BLOCK_HEADER_SIZE + offset + 1, value);
        },
        /**
         * This is a first-fit free list allocator
         * each block has the following format:
         *  1. The bytes 0-3 are the size of the block
         *  2. The bytes 4-7 are the pointer to the next block
         *  3. The next byte hold the mark bit
         *  4. The rest of the block is the actual data space
         * 
         * index 0 is reserved for the null pointer, so the first block starts at bit 64
         * index 1 is reserved for the head of the free list
         * 
         */
        mem_alloc: (size: number) => {
            let curr_ptr = get_free_list_head_ptr(); // head of the free list
            let prev_ptr = curr_ptr;
            while (get_block_size(curr_ptr) <= size + BLOCK_HEADER_SIZE) { // block is too small
                if (curr_ptr + 1 > memory.byteLength) { // we have reached the end of the memory
                    throw new Error("Out of memory");
                }
                if (get_block_next_ptr(curr_ptr) == 0) { // we have reached the end of the list
                    throw new Error("Out of memory");
                }
                prev_ptr = curr_ptr;
                curr_ptr = get_block_next_ptr(curr_ptr); // next block
            }

            // we have found a block that is big enough
            if (get_block_size(curr_ptr) - size > BLOCK_HEADER_SIZE + 4) { // we can split the block
                const new_block_ptr = curr_ptr + size + BLOCK_HEADER_SIZE;

                set_block_size(new_block_ptr, get_block_size(curr_ptr) - size - BLOCK_HEADER_SIZE); // set the size of the current block
                set_block_next_ptr(new_block_ptr, get_block_next_ptr(curr_ptr)); // set the pointer of the new block

                if (prev_ptr !== curr_ptr) {
                    set_block_next_ptr(prev_ptr, new_block_ptr); // set the pointer of the new block to the current block
                }

                if (curr_ptr === get_free_list_head_ptr()) { // we are at the head of the list
                    set_free_list_head_ptr(new_block_ptr);
                }

                // the current block is now allocated
                set_block_size(curr_ptr, size + BLOCK_HEADER_SIZE); // set the size of the current block
                set_block_mark(curr_ptr, 0); // set the mark bit to zero
            }

            return curr_ptr;
        },

        initialize_memory: () => {
            memory.setUint8(0, 0); // null pointer
            memory.setUint32(1, FREE_LIST_START); // head of the free list
            memory.setUint32(FREE_LIST_START, 3000);
            memory.setUint32(9, 0); // next block
            memory.setUint8(13, 0); // mark bit to 0
        }
    }
};

