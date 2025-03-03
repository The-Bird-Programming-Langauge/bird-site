import wabt from 'wabt';
import { consoleOutput } from './console-output';
import { textEditorCode } from './text-editor-code';
import { currentCompiledWat } from './current-compiled-wat';
import { dev } from '$app/environment';

const SERVER_URL = dev ? "http://localhost:5172" : "https://api.bird-lang.org";

export async function compileBird(code: string) {
    const response = await fetch(`${SERVER_URL}/compile-bird`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({ code })
    });

    if (response.status === 500) {
        const text = await response.text();
        consoleOutput.update((old) => [...old, text]);
        return;
    }

    const buffer = await response.arrayBuffer();
    compileWasm(buffer);
}

let instance: WebAssembly.Instance | undefined;
let memory: DataView | undefined;
let wasmMemory: WebAssembly.Memory;

export async function compileWat(code: string) {
    try {
        const wabtInterface = await wabt();
        const mod = wabtInterface.parseWat('test.wat', code);
        const buffer = mod.toBinary({ log: true }).buffer;
        const module = await WebAssembly.compile(buffer);
        const wasmInstance = new WebAssembly.Instance(module, moduleOptions);
        instance = wasmInstance;
        memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);
        wasmMemory = instance.exports.memory as WebAssembly.Memory;

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
        wasmMemory = instance.exports.memory as WebAssembly.Memory;

        console.time("wasm");
        (instance.exports.main as () => void)();
        console.timeEnd("wasm");
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


let base_offset = 0;
const NULL_PTR = 0;
const FREE_HEAD_PTR = 1;
const ALLOCATED_HEAD_PTR = 5;
const BLOCK_SIZE_OFFSET = 0;
const BLOCK_PTR_OFFSET = 4;
const BLOCK_MARK_OFFSET = 8;
const BLOCK_NUM_PTRS = 9;
const BLOCK_HEADER_SIZE = 13;
const FREE_LIST_START = 13;

const FLOAT_SIZE = 8;
const INT_SIZE = 4;


function get_null_ptr_address() {
    return base_offset + NULL_PTR;
}

function get_free_list_head_ptr() {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    return memory.getUint32(base_offset + FREE_HEAD_PTR);
}

function get_allocated_list_head_ptr() {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    return memory.getUint32(base_offset + ALLOCATED_HEAD_PTR);
}

function get_block_size(ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    return memory.getUint32(ptr + BLOCK_SIZE_OFFSET);
}

function get_block_next_ptr(ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    return memory.getUint32(ptr + BLOCK_PTR_OFFSET);
}

function block_is_marked(ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    return memory.getUint8(ptr + BLOCK_MARK_OFFSET) === 1;
}

function set_block_size(ptr: number, size: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    memory.setUint32(ptr + BLOCK_SIZE_OFFSET, size);
}

function set_block_next_ptr(ptr: number, next_ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    memory.setUint32(ptr + BLOCK_PTR_OFFSET, next_ptr);
}

function get_block_num_ptrs(ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    return memory.getUint32(ptr + BLOCK_NUM_PTRS);
}

function set_block_num_ptrs(ptr: number, num_ptrs: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    memory.setUint32(ptr + BLOCK_NUM_PTRS, num_ptrs);
}

function set_block_mark(ptr: number, mark: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    memory.setUint8(ptr + BLOCK_MARK_OFFSET, mark);
}

function set_free_list_head_ptr(ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    memory.setUint32(base_offset + FREE_HEAD_PTR, ptr);
}

function set_allocated_list_head_ptr(ptr: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    memory.setUint32(base_offset + ALLOCATED_HEAD_PTR, ptr);
}

const moduleOptions = {
    env: {
        strcat: (left: number, right: number) => {
            if (!instance) {
                throw new Error("Instance not initialized");
            }
            const buffer = new Uint8Array((instance.exports.memory as WebAssembly.Memory).buffer);
            let length = 0;
            for (let i = left; buffer[i] != 0; i++) {
                length += 1;
            }

            for (let i = right; buffer[i] != 0; i++) {
                length += 1;
            }

            const ptr = mem_alloc(length + 1, 0); // one extra for \0

            let pos = ptr;
            for (let i = right; buffer[i] != 0; i++) {
                buffer[pos] = buffer[i];
                pos += 1;
            }

            for (let i = left; buffer[i] != 0; i++) {
                buffer[pos] = buffer[i];
                pos += 1;
            }

            buffer[pos] = "\0".charCodeAt(0);
            return ptr;
        },
        strcmp: (left: number, right: number) => {
            if (!instance) {
                throw new Error("Instance not initialized");
            }
            const buffer = new Uint8Array((instance.exports.memory as WebAssembly.Memory).buffer);

            const i = left;
            const j = right;
            while (buffer[i] != buffer[j]) {
                if (buffer[i] != buffer[j]) {
                    return false;
                }

                if (buffer[i] == "\0".charCodeAt(0) || buffer[j] == "\0".charCodeAt(0)) {
                    return buffer[i] == "\0".charCodeAt(0) && buffer[i] == "\0".charCodeAt(0);
                }
            }

            return true;
        },
        print_i32: (value: number) => {
            consoleOutput.update(old => [...old, value.toString()]);
            console.log(value.toString());
        },
        print_f64: (value: number) => {
            consoleOutput.update(old => [...old, value.toString()]);
            console.log(value.toString());
        },
        print_bool: (value: number) => {
            const bool_str = value === 1 ? "true" : "false";
            consoleOutput.update(old => [...old, bool_str]);
            console.log(bool_str);
        },
        print_str: (ptr: number) => {
            if (!instance) {
                throw new Error("Instance not initialized");
            }
            const buffer = new Uint8Array((instance.exports.memory as WebAssembly.Memory).buffer);
            let str = "";
            for (let i = ptr; buffer[i] !== 0; i++) {
                str += String.fromCharCode(buffer[i]);
            }

            consoleOutput.update(old => [...old, str]);
            console.log(str);
        },
        print_endline: () => {
            console.log();
            consoleOutput.update(old => [...old, "\n"]);
        },
        mem_get_32: (ptr: number, byte_offset: number) => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            return memory.getUint32(ptr + BLOCK_HEADER_SIZE + byte_offset);
        },

        mem_get_64: (ptr: number, byte_offset: number) => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            return memory.getFloat64(ptr + BLOCK_HEADER_SIZE + byte_offset);
        },
        /**
         * The first byte of the pointer is used to store the pointer bit 
         * 
         */
        mem_set_32: (ptr: number, offset: number, value: number) => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            // memory.setUint8(ptr + BLOCK_HEADER_SIZE + offset, 0);
            memory.setUint32(ptr + BLOCK_HEADER_SIZE + offset, value);
        },
        mem_set_64: (ptr: number, offset: number, value: number) => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            // memory.setUint8(ptr + BLOCK_HEADER_SIZE + offset, 0b10);
            memory.setFloat64(ptr + BLOCK_HEADER_SIZE + offset, value);
        },
        mem_set_ptr: (ptr: number, offset: number, value: number) => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            // memory.setUint8(ptr + BLOCK_HEADER_SIZE + offset, 0b01);
            memory.setUint32(ptr + BLOCK_HEADER_SIZE + offset, value);
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
        mem_alloc,

        mark: (ptr: number) => // the root is any local or global variable that is dynamically allocated
        {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            const stack: number[] = [];
            stack.push(ptr);

            while (stack.length > 0) {
                // pointer to the current block
                const block_ptr = stack.pop();
                if (!block_ptr) {
                    throw new Error("Found undefined pointer while marking");
                }

                // if the block is already marked, skip it. otherwise mark it
                if (block_is_marked(block_ptr)) {
                    continue;
                } else {
                    set_block_mark(block_ptr, 1);
                }

                const num_ptrs = get_block_num_ptrs(block_ptr);
                for (let i = 0; i < num_ptrs; i++) {
                    stack.push(memory.getUint32(block_ptr + BLOCK_HEADER_SIZE + (INT_SIZE * i)));
                }
            }
        },

        sweep: () => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            let curr_ptr = get_allocated_list_head_ptr();

            // no allocated block exists
            if (curr_ptr === 0 || curr_ptr === get_null_ptr_address()) {
                return;
            }

            let prev_ptr = curr_ptr;
            let next_block_is_not_null = true;

            while (curr_ptr < memory.byteLength && next_block_is_not_null) {
                const next_ptr = get_block_next_ptr(curr_ptr); // get the next allocated block to traverse to in the next iteration
                let update_prev_ptr = true;

                // the loop should stop when we reach the end of the allocated list
                if (next_ptr === get_null_ptr_address()) {
                    next_block_is_not_null = false;
                }

                // if the block is not marked, pop it from the allocated list and push it to the free list
                if (!block_is_marked(curr_ptr)) {

                    // pop the block from the allocated list:
                    // if the block is the head, set the allocated list head pointer to the next allocated block pointer
                    if (curr_ptr === get_allocated_list_head_ptr()) {
                        set_allocated_list_head_ptr(next_ptr);
                        // otherwise, set the previous block's next pointer to the current block's next pointer
                    } else {
                        set_block_next_ptr(prev_ptr, next_ptr);
                        update_prev_ptr = false; // do not update prev_ptr if the block gets popped from the middle of the list
                    }

                    // add the block to the head of the free list
                    set_block_next_ptr(curr_ptr, get_free_list_head_ptr());
                    set_free_list_head_ptr(curr_ptr);
                } else {
                    set_block_mark(curr_ptr, 0); // clear the mark bit
                }

                if (update_prev_ptr) {
                    prev_ptr = curr_ptr;
                }
                curr_ptr = next_ptr;
            }
        },

        initialize_memory: (offset: number) => {
            if (!memory) {
                throw new Error("Memory not initialized");
            }
            base_offset = offset;
            // initialize the memory header
            memory.setUint8(base_offset + NULL_PTR, 0); // set the null pointer to 0
            set_free_list_head_ptr(FREE_LIST_START + base_offset); // set the free list head pointer to the first free block
            set_allocated_list_head_ptr(0 + base_offset); // set the allocated list head pointer to 0

            // create the first free block
            set_block_size(base_offset + FREE_LIST_START, memory.byteLength); // set the size to take up the entire memory
            set_block_next_ptr(base_offset + FREE_LIST_START, 0); // set the next pointer to the null pointer
            set_block_mark(base_offset + FREE_LIST_START, 0); // set the mark bit to 0
        }
    }
};

function mem_alloc(size: number, num_pointers: number) {
    if (!memory) {
        throw new Error("Memory not initialized");
    }
    if (!instance) {
        throw new Error("Instance not initialized");
    }
    let curr_ptr = get_free_list_head_ptr();
    let prev_ptr = curr_ptr;

    // loop until curr_ptr stores a block pointer that is big enough
    while (!(
        get_block_size(curr_ptr) > size + 2 * BLOCK_HEADER_SIZE || // block that is bigger and can be split into 2 blocks, 1 allocated and 1 free, such that the free block has at least 1 byte of data space
        get_block_size(curr_ptr) >= size + BLOCK_HEADER_SIZE // block that is exactly the right size
    )) {
        if (curr_ptr + 1 > memory.byteLength) { // we have reached the end of the memory
            throw new Error("Out of memory");
        }
        if (get_block_next_ptr(curr_ptr) === get_null_ptr_address()) { // we have reached the end of the list
            wasmMemory.grow(1);
            memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);
            set_block_size(curr_ptr, memory.byteLength - curr_ptr);
            break;
        }

        prev_ptr = curr_ptr;
        curr_ptr = get_block_next_ptr(curr_ptr); // next block
    }

    // we have found a block that is big enough
    if (get_block_size(curr_ptr) - size > BLOCK_HEADER_SIZE + FLOAT_SIZE * 2) { // we can split the block
        const new_block_ptr = curr_ptr + size + BLOCK_HEADER_SIZE;

        set_block_size(new_block_ptr, get_block_size(curr_ptr) - size - BLOCK_HEADER_SIZE); // set the size of the new block
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

        // move the current block to the head of the allocated list
        set_block_next_ptr(curr_ptr, get_allocated_list_head_ptr()); // set the pointer of the current block
        set_allocated_list_head_ptr(curr_ptr); // set the head of the allocated list
    }

    set_block_num_ptrs(curr_ptr, num_pointers);

    return curr_ptr;
}