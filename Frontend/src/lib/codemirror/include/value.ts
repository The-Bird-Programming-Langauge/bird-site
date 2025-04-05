export class Value {
  data: any;
  is_mutable: boolean;

  constructor(data: any = null, is_mutable: boolean = false) {
    this.data = data;
    this.is_mutable = is_mutable;
  }

  add(right: Value): Value {
    if (is_matching_type(this, right, "string")) {
      return new Value(this.data + right.data);
    }

    if (!is_numeric(this) || !is_numeric(right)) {
      throw new Error("The '+' binary operator could not be used to interpret these values.");
    }

    return new Value(to_type(this, "number", "number") + to_type(right, "number", "number"));
  }

  subtract(right: Value): Value {
    if (!is_numeric(this) || !is_numeric(right)) {
      throw new Error("The '-' binary operator could not be used to interpret these values.");
    }

    return new Value(to_type(this, "number", "number") - to_type(right, "number", "number"));
  }

  multiply(right: Value): Value {
    if (!is_numeric(this) || !is_numeric(right)) {
      throw new Error("The '*' binary operator could not be used to interpret these values.");
    }

    return new Value(to_type(this, "number", "number") * to_type(right, "number", "number"));
  }

  divide(right: Value): Value {
    if (to_type(right, "number", "number") === 0) {
      throw new Error("Division by zero.");
    }

    if (!is_numeric(this) || !is_numeric(right)) {
      throw new Error("The '/' binary operator could not be used to interpret these values.");
    }

    return new Value(to_type(this, "number", "number") / to_type(right, "number", "number"));
  }

  modulo(right: Value): Value {
    if (to_type(right, "number", "number") === 0) {
      throw new Error("Modulo by zero.");
    }

    if (!is_type(this, "number") || !is_type(right, "number")) {
      throw new Error("The '%' binary operator could not be used to interpret these values.");
    }

    const left_val = this.data;
    const right_val = right.data;
    return new Value(left_val % right_val);
  }

  greater_than(right: Value): Value {
    if (!is_numeric(this) || !is_numeric(right)) {
      throw new Error("The '>' binary operator could not be used to interpret these values.");
    }

    const left_val = this.data;
    const right_val = right.data;
    return new Value(left_val > right_val);
  }

  greater_than_or_equal(right: Value): Value {
    if (!is_numeric(this) || !is_numeric(right)) {
      throw new Error("The '>=' binary operator could not be used to interpret these values.");
    }

    const left_val = this.data;
    const right_val = right.data;
    return new Value(left_val >= right_val);
  }

  less_than(right: Value): Value {
    if (!is_type(this, "number") || !is_numeric(right)) {
      throw new Error("The '<' binary operator could not be used to interpret these values.");
    }

    return new Value(this.data < to_type(right, "number", "number"));
  }

  less_than_or_equal(right: Value): Value {
    if (!is_type(this, "number") || !is_numeric(right)) {
      throw new Error("The '<=' binary operator could not be used to interpret these values.");
    }

    return new Value(this.data <= to_type(right, "number", "number"));
  }

  not_equal(right: Value): Value {
    if (is_numeric(this) && is_numeric(right)) {
      const left_double = to_type(this, "number", "number");
      const right_double = to_type(right, "number", "number");
      return new Value(left_double !== right_double);
    }

    if (is_type(this, "string") && is_type(right, "string")) {
      return new Value(this.data !== right.data);
    }

    if (is_type(this, "boolean") && is_type(right, "boolean")) {
      return new Value(this.data !== right.data);
    }

    if (is_type(this, 'null') && is_type(right, 'null')) {
      return new Value(false);
    }

    if (is_type(this, 'null') || is_type(right, 'null')) {
      return new Value(true);
    }

    throw new Error("The '!=' binary operator could not be used to interpret these values.");
  }

  equal(right: Value): Value {
    if (is_numeric(this) && is_numeric(right)) {
      const left_double = to_type(this, "number", "number");
      const right_double = to_type(right, "number", "number");
      return new Value(left_double === right_double);
    }

    if (is_type(this, "string") && is_type(right, "string")) {
      return new Value(this.data === right.data);
    }

    if (is_type(this, "boolean") && is_type(right, "boolean")) {
      return new Value(this.data === right.data);
    }

    throw new Error("The '==' binary operator could not be used to interpret these values.");
  }

  not(): Value {
    if (is_type(this, "boolean")) {
      return new Value(!this.data);
    }

    throw new Error("The '!' unary operator could not be used to interpret these values.");
  }

  negate(): Value {
    if (is_type(this, "number")) {
      return new Value(-this.data);
    }

    throw new Error("The '-' unary operator could not be used to interpret these values.");
  }

  assign(right: Value): Value {
    if (this !== right) {
      this.data = right.data;
      this.is_mutable = this.is_mutable ? true : right.is_mutable;
    }

    return this;
  }

  index(index: Value): Value {
    if (is_type(this, "string")) {
      if (!is_type(index, "number")) {
        throw new Error("The subscript operator requires an integer index.");
      }

      const str = this.data;
      const idx = index.data;

      if (idx < 0 || idx >= str.length) {
        throw new Error("Index out of bounds.");
      }

      return new Value(str[idx]);
    }

    if (is_type(this, "array")) {
      if (!is_type(index, "number")) {
        throw new Error("The subscript operator requires an integer index.");
      }

      const arr = this.data;
      const idx = index.data;

      if (idx < 0 || idx >= arr.length) {
        throw new Error("Index out of bounds.");
      }

      return new Value(arr[idx]);
    }

    throw new Error("The subscript operator could not be used to interpret these values.");
  }
}

function is_type(value: Value, type: string): boolean {
  return value instanceof Value && value.data !== null && typeof value.data === type;
}

function is_numeric(value: Value): boolean {
  return is_type(value, "number");
}

function is_matching_type(left: Value, right: Value, type: string): boolean {
  return is_type(left, type) && is_type(right, type);
}

function as_type(value: Value, type: string): any {
  if (is_type(value, type)) {
    return value.data;
  }

  throw new Error("value is not of the expected type");
}

function to_type(value: Value, target_type: string, source_type: string): any {
  if (is_type(value, target_type)) {
    return as_type(value, target_type);
  }

  const converted_value = as_type(value, source_type);

  if (target_type === "number") {
    return Number(converted_value);
  } else if (target_type === "string") {
    return String(converted_value);
  } else if (target_type === "boolean") {
    return Boolean(converted_value);
  }
}

export class SemanticValue {
  is_mutable: boolean;

  constructor(isMutable: boolean = false) {
    this.is_mutable = isMutable;
  }
};