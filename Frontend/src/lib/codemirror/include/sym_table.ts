export class Environment<T> {
  private envs: Map<string, T>[];

  constructor() {
    this.envs = [];
  }

  push_env() {
    this.envs.push(new Map<string, T>());
  }

  pop_env() {
    if (this.envs.length === 0) {
      throw new Error("no environment to pop");
    }
    
    this.envs.pop();
  }

  current_contains(identifier: string): boolean {
    if (this.envs.length === 0) {
      return false;
    }

    return this.envs[this.envs.length - 1].has(identifier);
  }

  get_depth(identifier: string): number {
    for (let i = this.envs.length - 1; i >= 0; i--) {
      if (this.envs[i].has(identifier)) {
        return i;
      }
    }

    return 0;
  }

  contains(identifier: string): boolean {
    return this.envs.some(env => env.has(identifier));
  }

  declare(identifier: string, value: T) {
    if (this.envs.length === 0) {
      throw new Error(`no environment to declare variable ${identifier} into`);
    }
    if (this.current_contains(identifier)) {
      throw new Error(`variable ${identifier} already declared in current environment`);
    }

    this.envs[this.envs.length - 1].set(identifier, value);
  }

  set(identifier: string, value: T) {
    for (let i = this.envs.length - 1; i >= 0; i--) {
      if (this.envs[i].has(identifier)) {
        this.envs[i].set(identifier, value);
        return;
      }
    }

    throw new Error(`cannot set undefined identifier in environment: ${identifier}`);
  }

  get(identifier: string): T {
    for (let i = this.envs.length - 1; i >= 0; i--) {
      if (this.envs[i].has(identifier)) {
        return this.envs[i].get(identifier) as T;
      }
    }

    throw new Error(`cannot get undefined identifier in environment: ${identifier}`);
  }
}