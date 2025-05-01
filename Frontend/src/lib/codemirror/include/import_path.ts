export class ImportPath {
  path: string[];
  string_path: string;

  constructor();
  constructor(path: string[]);
  constructor(string_path: string);
  constructor(param?: string[] | string) {
    if (Array.isArray(param)) {
      this.path = param;
      this.string_path = this.path_to_string_path(param);
    } else if (typeof param === "string") {
      this.string_path = param;
      this.path = this.string_path_to_path(param);
    } else {
      this.path = [];
      this.string_path = "";
    }
  }

  get_file_path(): string {
    return this.path.join("/");
  }

  add_string_token(string_token: string): void {
    this.path.push(string_token);
    this.string_path += (this.string_path ? "::" : "") + string_token;
  }

  insert_import_path_at_beginning(import_path: ImportPath): void {
    this.path = [...import_path.path, ...this.path];
    this.string_path = import_path.string_path + (this.string_path ? "::" + this.string_path : "");
  }

  path_to_string_path(path: string[]): string {
    return path.join("::");
  }

  string_path_to_path(string_path: string): string[] {
    return string_path.split("::");
  }
}