---
title: "Discriminated Unions on TypeScript"
description: "description"
pubDate: "Sep 14 2024"
heroImage: "/typescript.png"
---

Imagine you have a function that calculates the area of a geometric figure. Let's create a `Shape` interface and focus on two basic figures for now: a `circle` and a `square`.

Going back to some high school math, to calculate the area of a `circle`, we need to use the formula `π * radius²`, or `π * radius * radius`. For a `square`, we need the `sideLength`. So, to calculate the area of a square, we can multiply the side length by itself: `sideLength * sideLength`.

How would we implement this in TypeScript? We could define a interface like this:

```tsx
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

In this interface, the `kind` property defines whether the shape is a circle or a square. Based on that, we could provide either the `radius` or the `sideLength`. But this doesn't quite work, does it?

Shouldn't the following example give us an error?
<img src="/calculate-area-function-no-error-example.png" />

Let's look at the following function:

```tsx
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // We got a error right here: 'shape.radius' is possibly 'undefined'.ts(18048)
  } else {
    return shape.sideLength ** 2;
    // And another one right here: 'shape.sideLength' is possibly 'undefined'.ts(18048)
  }
}
```

Why is that happening?

It's because both `radius` and `sideLength` are optional parameters in the interface! You might only pass the `kind` property, since it's the only required one. This means for the function, you could omit both `radius` and `sideLength`, because they are not required.

However, if you pass neither, you'll encounter an error like this:

`Argument of type '{}' is not assignable to parameter of type 'Shape'. Property 'kind' is missing in type '{}' but required in type 'Shape'.ts(2345)`.

Ok, Gabriel. But how do we fix this problem? Using <span class="font-bold">Discriminated Unions!</span>

We can define a new type called `Circle` that requires both a `kind` and a `radius` properties. Similarly, we can declare another type called `Square`, which also requires a `kind` but uses `sideLength` instead of `radius`. But here's the key: for the `Circle` type, the `kind` property must strictly equal `"circle”`, and for the `Square` type, it must be `"square”`.

```tsx
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
```

Great! Now we can create our `Shape` type!

```tsx
type Shape = Circle | Square;
```

And look at that, no errors in our `calculateArea` function!
<img src="/no-errors-calculate-area-function.png" />

We even get a great autocomplete!

<img src="/calculate-area-function-with-auto-complete.png" />
<img src="/calculate-area-function-radius-autocomplete.png" />

And if we try to pass an incorrect property, we'll get a helpful error:

<img src="/calculate-area-function-radius-error-on-square-type.png" />

`Object literal may only specify known properties, and 'radius' does not exist in type 'Square'.ts(2353)`

Thank you for reading! I hope this article helps you better understand how to use discriminated unions in TypeScript. Happy coding!

For reference:

- <span class="font-bold">π (pi)</span>: The mathematical constant used in the formula for the area of a circle.
- <a target="_blank" href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions" class="dark:text-white dark:hover:text-gray-100">TypeScript documentation on Discriminated Unions</a>
