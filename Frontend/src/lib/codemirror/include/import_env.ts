import { ImportPath } from './import_path';

export class ImportItem {}

export class ImportNamespace extends ImportItem {
  import_items: { [key: string]: ImportItem };

  constructor(import_items: { [key: string]: ImportItem } = {}) {
    super();
    this.import_items = import_items;
  }
}

export class VariableImportItem extends ImportItem {}
export class StructImportItem extends ImportItem {}
export class TypeImportItem extends ImportItem {}
export class FunctionImportItem extends ImportItem {}

export class ImportEnvironment {
  namespace_item: ImportNamespace;

  constructor(namespace_item: ImportNamespace = new ImportNamespace()) {
    this.namespace_item = namespace_item;
  }

  contains_item(import_path: ImportPath): boolean {
    let current = this.namespace_item;

    for (let i = 0; i < import_path.path.length - 1; i += 1) {
      if (!(import_path.path[i] in current.import_items)) {
        return false;
      }

      const next = current.import_items[import_path.path[i]];
      if (!(next instanceof ImportNamespace)) {
        throw new Error(`'${import_path.path[i]}' is not a namespace`);
      }

      current = next;
    }

    return import_path.path[import_path.path.length - 1] in current.import_items;
  }

  add_item(import_path: ImportPath, import_item: ImportItem): void {
    let current = this.namespace_item;

    for (let i = 0; i < import_path.path.length - 1; i += 1) {
      if (!(import_path.path[i] in current.import_items)) {
        current.import_items[import_path.path[i]] = new ImportNamespace();
      }

      const namespace_item = current.import_items[import_path.path[i]];
      if (!(namespace_item instanceof ImportNamespace)) {
        throw new Error(`'${import_path.path[i]}' is not a namespace`);
      }

      current = namespace_item;
    }

    current.import_items[import_path.path[import_path.path.length - 1]] = import_item;
  }

  get_item(import_path: ImportPath): ImportItem {
    let current = this.namespace_item;

    for (let i = 0; i < import_path.path.length - 1; i += 1) {
      const next_item = current.import_items[import_path.path[i]];

      if (!(next_item instanceof ImportNamespace)) {
        throw new Error(`'${import_path.path[i]}' is not a namespace`);
      }

      current = next_item;
    }

    return current.import_items[import_path.path[import_path.path.length - 1]];
  }

  get_items_recursively(import_path: ImportPath): [ImportPath[], ImportItem[]] {
    const paths: ImportPath[] = [];
    const items: ImportItem[] = [];

    let current = this.namespace_item;

    for (let i = 0; i < import_path.path.length - 1; i += 1) {
      const next_item = current.import_items[import_path.path[i]];

      if (!(next_item instanceof ImportNamespace)) {
        throw new Error(`'${import_path.path[i]}' is not a namespace`);
      }

      current = next_item;
    }

    const current_item = current.import_items[import_path.path[import_path.path.length - 1]];

    const dfs = (current_path: ImportPath, import_item: ImportItem): void => {
      if (import_item instanceof ImportNamespace) {
        for (const [key, value] of Object.entries(import_item.import_items)) {
          const new_path = new ImportPath([...current_path.path]);
          new_path.add_string_token(key);
          dfs(new_path, value);
        }
      } else {
        paths.push(current_path);
        items.push(import_item);
      }
    };

    dfs(import_path, current_item);

    return [paths, items];
  }
}