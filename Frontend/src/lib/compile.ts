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

export async function compileWat(code: string) {
    try {
        const wabtInterface = await wabt();
        const mod = wabtInterface.parseWat('test.wat', code);
        const buffer = mod.toBinary({ log: true }).buffer;
        const module = await WebAssembly.compile(buffer);
        const wasmInstance = new WebAssembly.Instance(module, moduleOptions);
        instance = wasmInstance;
        memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);
        mem = new Memory(memory);

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
        const mod = wabtInterface.readWasm(new Uint8Array(buffer), { readDebugNames: true, exceptions: true });
        const text = mod.toText({ foldExprs: true, inlineExport: true });

        currentCompiledWat.set(text);

        const module = await WebAssembly.compile(buffer);
        const wasmInstance = new WebAssembly.Instance(module, moduleOptions);
        instance = wasmInstance;
        memory = new DataView((instance.exports.memory as WebAssembly.Memory).buffer);
        mem = new Memory(memory);

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
        const mod = wabtInterface.readWasm(new Uint8Array(code), { readDebugNames: true, exceptions: true });
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
class Printer {
    print_i32(value: number) {
        console.log(value);
        consoleOutput.update(old => [...old, value.toString()]);
    }
    print_char(value: number) {
        const char = String.fromCharCode(value);
        console.log(char);
        consoleOutput.update(old => [...old, char]);
    }
    print_f64(value: number) {
        console.log(value);
        consoleOutput.update(old => [...old, value.toString()]);
    }
    print_bool(value: number) {
        console.log(!!value);
        consoleOutput.update(old => [...old, (!!value).toString()]);
    }
    print_str(ptr: number) {
        const ref = mem.get(ptr);
        const array_ptr = mem.get(ref.get_32(0));
        const data = mem.get(array_ptr.get_32(0));
        const length = array_ptr.get_32(4);

        let str = "";
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(data.get_32(i * 4));
        }

        consoleOutput.update(old => [...old, str]);
        console.log(str)
    }
    print_endline() {
        console.log();
    }
};

class Block {
    static SIZE_OFFSET = 4;
    static NUM_PTRS_OFFSET = 8;
    static MARKED_BIT_OFFSET = 12;
    static NEXT_PTR_OFFSET = 16;
    static BLOCK_HEADER_SIZE = 16;
    ptr: number;
    memory: DataView;
    constructor(ptr: number, memory: DataView) {
        this.ptr = ptr;
        this.memory = memory;
    }

    get_64(offset: number) {
        return this.memory.getFloat64(this.ptr + offset);
    }

    get_32(offset: number) {
        return this.memory.getUint32(this.ptr + offset);
    }

    set_64(offset: number, value: number) {
        return this.memory.setFloat64(this.ptr + offset, value);
    }

    set_32(offset: number, value: number) {
        return this.memory.setUint32(this.ptr + offset, value);
    }

    get_address() {
        return this.ptr;
    }

    get_num_ptrs() {
        return this.memory.getUint32(this.ptr - Block.NUM_PTRS_OFFSET);
    }

    get_size() {
        return this.memory.getUint32(this.ptr - Block.SIZE_OFFSET);
    }

    get_marked() {
        return this.memory.getUint32(this.ptr - Block.MARKED_BIT_OFFSET) & 0b01;
    }

    get_root() {
        return this.memory.getUint32(this.ptr - Block.MARKED_BIT_OFFSET) & 0b10;
    }

    get_next_address() {
        return this.memory.getUint32(this.ptr - Block.NEXT_PTR_OFFSET);
    }

    set_next_address(ptr: number) {
        this.memory.setUint32(this.ptr - Block.NEXT_PTR_OFFSET, ptr);
    }

    set_marked(marked: number) {
        if (marked) {
            this.memory.setUint32(this.ptr - Block.MARKED_BIT_OFFSET, this.memory.getUint32(this.ptr - Block.MARKED_BIT_OFFSET) | 0b01);
        } else {
            this.memory.setUint32(this.ptr - Block.MARKED_BIT_OFFSET, this.memory.getUint32(this.ptr - Block.MARKED_BIT_OFFSET) & 0b10);
        }
    }

    set_root(root: number) {
        if (root) {
            this.memory.setUint32(this.ptr - Block.MARKED_BIT_OFFSET, this.memory.getUint32(this.ptr - Block.MARKED_BIT_OFFSET) | 0b10);
        } else {
            this.memory.setUint32(this.ptr - Block.MARKED_BIT_OFFSET, this.memory.getUint32(this.ptr - Block.MARKED_BIT_OFFSET) & 0b01);
        }
    }

    set_num_ptrs(num_ptrs: number) {
        this.memory.setUint32(this.ptr - Block.NUM_PTRS_OFFSET, num_ptrs);
    }

    set_size(byte_size: number) {
        this.memory.setUint32(this.ptr - Block.SIZE_OFFSET, byte_size);
    }
}

class Memory {
    static NULL = 0; // 4 bytes
    static FREE_LIST_HEAD_PTR = 4; // 4 bytes
    static ALLOCATED_LIST_HEAD_PTR = 8; // 4 bytes
    memory: DataView;
    constructor(memory: DataView) {
        memory.setUint32(Memory.NULL, Memory.NULL);
        const first_initial_free = Memory.ALLOCATED_LIST_HEAD_PTR + 4 + Block.BLOCK_HEADER_SIZE;
        memory.setUint32(Memory.FREE_LIST_HEAD_PTR, first_initial_free);
        memory.setUint32(Memory.ALLOCATED_LIST_HEAD_PTR, Memory.NULL);

        const first_block = new Block(first_initial_free, memory);
        first_block.set_next_address(Memory.NULL);
        first_block.set_marked(0);
        // 12 accounting for null, free list head ptr, and allocated list head ptr
        first_block.set_size(memory.byteLength - 12);
        first_block.set_num_ptrs(0);

        this.memory = memory;
    }

    get(ptr: number) {
        return new Block(ptr, this.memory);
    }

    print_free_list() {
        console.log("printing free list");
        const free_list_head_ptr = this.get(Memory.FREE_LIST_HEAD_PTR).get_32(0);
        let node = this.get(free_list_head_ptr);
        while (node.get_address() != Memory.NULL) {
            console.log("free: ", node.get_address());
            node = this.get(node.get_next_address());
        }
    }

    print_allocated_list() {
        console.log("printing allocated list");
        const allocated_list_head_ptr = this.get(Memory.ALLOCATED_LIST_HEAD_PTR).get_32(0);
        let node = this.get(allocated_list_head_ptr);
        while (node.get_address() != Memory.NULL) {
            console.log("alloced: ", node.get_address());
            node = this.get(node.get_next_address());
        }
    }

    print_registered_blocks() {
        console.log("printing registered blocks");
        const allocated_list_head_ptr = this.get(Memory.ALLOCATED_LIST_HEAD_PTR).get_32(0);
        let node = this.get(allocated_list_head_ptr);
        while (node.get_address() != Memory.NULL) {
            if (node.get_root()) {
                console.log("registerd: ", node.get_address());
            }
            node = this.get(node.get_next_address());
        }

    }

    alloc(byte_size: number, num_ptrs: number) {
        let result = this.alloc_helper(byte_size, num_ptrs);
        if (result == Memory.NULL) {
            this.mark();
            this.sweep();
            result = this.alloc_helper(byte_size, num_ptrs);
            if (result == Memory.NULL) {
                throw Error("Could not find block big enough");
            }
        }

        return result;
    }

    alloc_helper(byte_size: number, num_ptrs: number) {
        const free_list_head_ptr = this.get(Memory.FREE_LIST_HEAD_PTR).get_32(0);
        let node = this.get(free_list_head_ptr);
        let prev;
        while (node.get_address() != Memory.NULL) {
            if (node.get_size() < byte_size + Block.BLOCK_HEADER_SIZE) {
                prev = node;
                node = this.get(node.get_next_address());
            } else {
                if (node.get_size() >= byte_size + Block.BLOCK_HEADER_SIZE * 2) {
                    // split block
                    const current_size = node.get_size();
                    const new_block_ptr = node.get_address() + byte_size + Block.BLOCK_HEADER_SIZE;
                    const new_block = this.get(new_block_ptr);

                    new_block.set_size(current_size - (byte_size + Block.BLOCK_HEADER_SIZE));
                    new_block.set_next_address(node.get_next_address());
                    new_block.set_marked(0);
                    new_block.set_num_ptrs(0);

                    node.set_size(byte_size + Block.BLOCK_HEADER_SIZE);
                    node.set_next_address(new_block.get_address());
                }

                if (prev) {
                    prev.set_next_address(node.get_next_address());
                } else {
                    this.memory.setUint32(Memory.FREE_LIST_HEAD_PTR, node.get_next_address());
                }

                node.set_next_address(this.get(Memory.ALLOCATED_LIST_HEAD_PTR).get_32(0));
                this.memory.setUint32(Memory.ALLOCATED_LIST_HEAD_PTR, node.get_address());
                node.set_num_ptrs(num_ptrs);
                return node.get_address();
            }
        }

        return Memory.NULL;
    }

    mark() {
        const allocated_list_head_ptr = this.get(Memory.ALLOCATED_LIST_HEAD_PTR).get_32(0);
        let node = this.get(allocated_list_head_ptr);
        while (node.get_address() != Memory.NULL) {
            if (node.get_root()) {
                this.mark_helper(node.get_address());
            }
            node = this.get(node.get_next_address());
        }
    }

    mark_helper(ptr: number) {
        const stack = [];
        stack.push(this.get(ptr));
        while (stack.length > 0) {
            const block = stack.pop()!;

            if (block.get_address() === 0) {
                continue;
            }

            if (block.get_marked()) {
                continue;
            }

            block.set_marked(1);
            const num_ptrs = block.get_num_ptrs();
            for (let i = 0; i < num_ptrs; i++) {
                const child = this.get(block.get_32(i * 4));
                stack.push(child);
            }
        }
    }

    sweep() {
        // this.print_registered_blocks();
        // this.print_allocated_list();
        // this.print_free_list();
        // go through allocated list
        // if block isn't marked, free it
        const allocated_list_head_ptr = this.get(Memory.ALLOCATED_LIST_HEAD_PTR).get_32(0);
        let node = this.get(allocated_list_head_ptr);
        let prev;

        while (node.get_address() != Memory.NULL) {
            if (!node.get_marked()) {
                for (let i = 0; i < (node.get_size() - Block.BLOCK_HEADER_SIZE) / 4; i++) {
                    node.set_32(i * 4, 0);
                }
                if (prev) {
                    prev.set_next_address(node.get_next_address());
                    node.set_next_address(this.get(Memory.FREE_LIST_HEAD_PTR).get_32(0));
                    this.memory.setUint32(Memory.FREE_LIST_HEAD_PTR, node.get_address());
                    node = this.get(prev.get_next_address());
                } else {
                    const next_ptr = node.get_next_address();
                    node.set_next_address(this.get(Memory.FREE_LIST_HEAD_PTR).get_32(0));
                    this.memory.setUint32(Memory.FREE_LIST_HEAD_PTR, node.get_address());

                    node = this.get(next_ptr);
                    this.memory.setUint32(Memory.ALLOCATED_LIST_HEAD_PTR, node.get_address());
                }
            } else {
                prev = node;
                node.set_marked(0);
                node = this.get(node.get_next_address());
            }
        }

        // this.print_free_list();
        // this.print_allocated_list();
        // this.print_registered_blocks();
    }
}


let instance: WebAssembly.Instance | undefined;
let memory: DataView;
const printer = new Printer();
let mem: Memory;

const moduleOptions = {
    env: {
        push_ptr,
        push_32,
        push_64,
        strcat,
        strcmp,
        print_i32: (value: number) => printer.print_i32(value),
        print_char: (value: number) => printer.print_char(value),
        print_f64: (value: number) => printer.print_f64(value),
        print_bool: (value: number) => printer.print_bool(value),
        print_str: (ptr: number) => printer.print_str(ptr),
        print_endline: () => printer.print_endline(),
        mem_get_32: (ptr: number, offset: number) => mem.get(ptr).get_32(offset),
        mem_get_64: (ptr: number, offset: number) => mem.get(ptr).get_64(offset),
        mem_set_32: (ptr: number, offset: number, value: number) => mem.get(ptr).set_32(offset, value),
        mem_set_64: (ptr: number, offset: number, value: number) => mem.get(ptr).set_64(offset, value),
        mem_alloc: (ptr: number, num_ptrs: number) => mem.alloc(ptr, num_ptrs),
        gc: () => { mem.mark(); mem.sweep(); },
        register_root: (ptr: number) => {
            if (ptr == 0) {
                return;
            }
            mem.get(ptr).set_root(1)
        },
        unregister_root: (ptr: number) => {
            if (ptr == 0) {
                return;
            }
            mem.get(ptr).set_root(0)
        },
    }
};

function push_ptr(arr_ptr: number, value: number) {
    const ref = mem.get(arr_ptr);
    const array = mem.get(ref.get_32(0));
    const length = array.get_32(4);
    push_32(arr_ptr, value);
    const after_data_ptr = array.get_32(0);

    mem.get(after_data_ptr).set_num_ptrs(length + 1);
    array.set_num_ptrs(1);
}

function push_32(arr_ptr: number, value: number) {
    const ref = mem.get(arr_ptr);
    const array = mem.get(ref.get_32(0));
    let data = mem.get(array.get_32(0));
    const length = array.get_32(4);
    const capacity = (data.get_size() - Block.BLOCK_HEADER_SIZE) / 4;

    if (length + 1 >= capacity) {
        const new_data = mem.get(mem.alloc(Math.max(length * 2 * 4, Block.BLOCK_HEADER_SIZE * 2), 0));
        for (let i = 0; i < length; i++) {
            new_data.set_32(i * 4, data.get_32(i * 4));
        }

        data = new_data;
    }

    data.set_32(length * 4, value);
    data.set_num_ptrs(0);

    array.set_32(0, data.get_address());
    array.set_32(4, length + 1);

    array.set_num_ptrs(1);
}

function push_64(arr_ptr: number, value: number) {
    const ref = mem.get(arr_ptr);
    const array = mem.get(ref.get_32(0));
    let data = mem.get(array.get_32(0));
    const length = array.get_32(4);
    const capacity = (data.get_size() - Block.BLOCK_HEADER_SIZE) / 8;

    if (capacity + 1 >= length) {
        const new_data = mem.get(mem.alloc(Math.max(length * 2 * 8, Block.BLOCK_HEADER_SIZE * 4), 0));
        for (let i = 0; i < length; i++) {
            new_data.set_64(i * 8, data.get_64(i * 8));
        }

        data = new_data;
    }

    data.set_64(length * 8, value);

    array.set_32(0, data.get_address());
    array.set_32(4, length + 1);
}

function strcat(left: number, right: number) {
    const left_ref = mem.get(left);
    const right_ref = mem.get(right);
    const left_array = mem.get(left_ref.get_32(0));
    const right_array = mem.get(right_ref.get_32(0));
    const left_data = mem.get(left_array.get_32(0));
    const left_length = left_array.get_32(4);
    const right_data = mem.get(right_array.get_32(0));
    const right_length = right_array.get_32(4);

    const new_ref = mem.get(mem.alloc(4, 1));
    const new_array = mem.get(mem.alloc(8, 1));
    const data = mem.get(mem.alloc(left_length * 4 + right_length * 4, 0));

    const new_length = left_length + right_length;
    new_array.set_32(0, data.get_address());
    new_array.set_32(4, new_length);

    for (let i = 0; i < left_length; i++) {
        const char = left_data.get_32(i * 4);
        data.set_32(i * 4, char);
    }

    for (let i = 0; i < right_length; i++) {
        const char = right_data.get_32(i * 4);
        data.set_32((i + left_length) * 4, char);
    }

    new_ref.set_32(0, new_array.get_address());
    return new_ref.get_address();
}

function strcmp(left: number, right: number) {
    const left_ref = mem.get(left);
    const right_ref = mem.get(right);
    const left_array = mem.get(left_ref.get_32(0));
    const right_array = mem.get(right_ref.get_32(0));
    const left_data = mem.get(left_array.get_32(0));
    const left_length = left_array.get_32(4);
    const right_data = mem.get(right_array.get_32(0));
    const right_length = right_array.get_32(4);

    if (left_length != right_length) {
        return false;
    }

    for (let i = 0; i < left_length; i++) {
        if (left_data.get_32(i * 4) != right_data.get_32(i * 4)) {
            return false;
        }
    }

    return true;
}

