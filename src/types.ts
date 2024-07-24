/**
 * Extracts the value type at the specified path in a union of objects.
 *
 * @template T A union of objects.
 * @template P A tuple representing the path.
 *
 * @example
 * type Example = Values<{ a: { b: 1 } } | { a: { b: 2 } }, ["a", "b"]>; // 1 | 2
 */
export type Values<T, U> = U extends [infer V, ...infer W]
  ? V extends keyof T
    ? Values<T[V], W>
    : never
  : T;

/**
 * Narrows an object type by changing a nested property type to a more specific one.
 *
 * @template T The base object type to be modified.
 * @template U A tuple of keys representing the path to the property to be modified.
 * @template V A tuple of keys representing the path of the object.
 * @template W The type of the value at the path of the object.
 *
 * @example
 * type Example = Narrow<{ a: { b: 1 } | { b: 2 } }, ["a"], ["b"], 1>; // { a: { b: 1 } }
 */
export type Narrow<T, U, V, W> = Change<T, U, Subset<Nested<T, U>, V, W>>;

/**
 * Changes the type of a nested property within an object based on a path and a new value type.
 *
 * @template T The base object type to be modified.
 * @template U A tuple of keys representing the path to the property to be modified.
 * @template V The new type for the property at the path of the object.
 *
 * @example
 * type Example = Change<{ a: { b: number } }, ["a", "b"], string>; // { a: { b: string } }
 */
export type Change<T, U, V> = U extends [infer W, ...infer X]
  ? W extends keyof T
    ? { [K in keyof T]: K extends W ? Change<T[W], X, V> : T[K] }
    : never
  : V;

/**
 * Extracts a subset of an union of objects based on a path and a value.
 *
 * @template T The union of objects from which to extract the subset.
 * @template U A tuple of keys representing a path in the object.
 * @template V The type of the value at the path of the object.
 *
 * @example
 * type Example = Subset<{ a: { b: 1 } } | { a: { b: 2 } }, ["a", "b"], 1>; // { a: { b: 1 } }
 */
export type Subset<T, U, V> = U extends [infer W, ...infer X]
  ? W extends keyof T
    ? Extract<T, { [K in W]: Schema<X, V> }>
    : never
  : never;

/**
 * Constructs an object type from a tuple of keys and a value type.
 *
 * @template T A tuple of strings representing the keys of the object.
 * @template U The type of the value at the deepest level of the object.
 *
 * @example
 * type Example = Schema<["a", "b"], 1>; // { a: { b: 1 } }
 */
export type Schema<T, U> = T extends [infer V, ...infer W]
  ? V extends string
    ? { [K in V]: Schema<W, U> }
    : never
  : U;

/**
 * Extracts the nested value type at the specified path in an object.
 *
 * @template T The base object type.
 * @template U A tuple representing the path of keys to the nested value.
 *
 * @example
 * type Example = Nested<{ a: { b: { c: 2 } } }, ["a", "b"]>; // { c: 2 }
 */
export type Nested<T, U> = U extends [infer V, ...infer W]
  ? V extends keyof T
    ? Nested<T[V], W>
    : never
  : T;
