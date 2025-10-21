---
title: "Type vs Interface in TypeScript: When and Why to Use Each"
description: "Understand the real differences between TypeScript's type and interface, when to use each, how they affect performance, and why interfaces are preferred for contracts and extensions."
pubDate: "Oct 21 2025"
heroImage: "/typescript.png"
---

## 🧩 Type vs Interface in TypeScript

In TypeScript, we have two ways to declare types: using the `type` keyword or the `interface` keyword.

They basically do the same thing, but there are a few key differences between them, and we’re going to cover those in this article.

---

## ⚡ TL;DR

- Both `type` and `interface` can define object shapes.
- `type` can also describe primitives, unions, and intersections.
- `interface` supports **declaration merging** and **extending multiple interfaces**.
- For composition, **prefer `interface extends` over `type &`**, since it’s faster and more predictable.
- Personally, I default to `type` unless I specifically need something that only `interface` provides.

---

### 🧠 **The Basics**

**Interfaces** are used only to describe **objects**, while **types** can describe not only objects but also **primitive values** like `string`, `number`, `boolean`, and more.

For example, you can do this with a type:

```tsx
type Address = string;

const address: Address = "123 Main Street";
```

But you **can’t** do the same with an interface! Interfaces can only describe **object shapes**.

## 🔀 Declaration Merging

One of the most important features that differentiates `interface` from `type` is called **Declaration Merging**.

This means that if we declare multiple interfaces with the same name, TypeScript automatically **merges them together**.

If we try the same with types, we’ll get an **error**.

```tsx
// ❌ Type alias throws an error
type User = {
  id: string;
};

type User = {
  name: string; // Error: Duplicate identifier 'User'
};
```

![Type Alias duplicate identifier](/type-duplicate-identifier.png)

```tsx
// ✅ Interfaces are merged automatically
interface User {
  id: string;
}

interface User {
  name: string;
}

const user: User = {
  id: "1",
  name: "John Doe",
};
```

![Interface declaration merging result](/interface-declaration-merging-type-result.png)

Notice how the interface version merges both declarations.

It even gives us a type error if we try to create a `User` object without `id` or `name`, because both properties now exist in the final merged type.

![Interface declaration merging error example](/interface-declaration-merging.png)

> 💡 Tip: It’s common among TypeScript developers to use prefixes or postfixes when naming types and interfaces, like `IUser`, `TUser`, or `UserType`.

## ⚙️ Performance Considerations

When it comes to **performance**, in modern TypeScript (especially after the [rewrite of the compiler in Go](https://devblogs.microsoft.com/typescript/typescript-native-port/)), there’s **not much difference** between using `type` or `interface` for most use cases.

However, there’s one specific scenario where **interfaces can perform better**: when handling **type extensions**.

According to the official [TypeScript performance guide](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections), interfaces are **cached internally**, while **type intersections** (`&`) are **recomputed each time** they are used.

In other words:

```tsx
// 👎 Recomputed every time
type Foo = Bar & Baz & { someProp: string };

// 👍 Cached and more efficient
interface Foo extends Bar, Baz {
  someProp: string;
}
```

So, when you’re composing multiple types, **prefer using `interface` with `extends`** rather than `type` with `&`.

## 🧩 The Official Recommendation

The [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) suggests **defaulting to interfaces** when possible.

However, my personal preference is to **default to `type`**, unless I specifically need a feature that only interfaces provide.

While **declaration merging** can be powerful, it can also lead to **unexpected issues** in large codebases with many developers, especially when people are unknowingly extending the same interface from different parts of the code.

## 🧭 Conclusion

Both `type` and `interface` are powerful tools in TypeScript, and they often overlap.

But understanding the small differences helps you make better design decisions in your code.

✅ Use **`interface`** when:

- You want to **extend** or **merge** structures.
- You’re defining **contracts or public APIs**.

✅ Use **`type`** when:

- You need **unions**, **primitives**, or **complex compositions**.
- You want a simpler and more flexible syntax.

Ultimately, consistency matters more than strict rules, so pick one approach that fits your team’s style and stick with it.
