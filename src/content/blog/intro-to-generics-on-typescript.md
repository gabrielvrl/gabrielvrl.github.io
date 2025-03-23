---
title: "Intro to Generics on TypeScript"
description: "Learn how to leverage Generics in TypeScript for better flexibility and type safety"
pubDate: "Mar 23 2025"
heroImage: "/typescript.png"
---

Imagine you are working on a React Native app and need to create a function that handles user input and processes it in different ways depending on the type of data provided. This is a perfect scenario for using _Generics_ in TypeScript.

With Generics, you can write functions, classes, and interfaces that work with any type while maintaining the safety and power of TypeScript’s static type checking. Instead of duplicating code for different types, Generics allow you to create reusable, flexible functions.

Let’s explore how Generics work in TypeScript with a simple example.

### The Problem: A Function to Display User Information

Suppose we want to create a function that displays user information, but the structure of the user data might differ. For example, we could have users who provide their name and age, or others who might also include their email address.

First, let’s define an interface for the user:

```tsx
interface User {
  name: string;
  age: number;
}

interface UserWithEmail extends User {
  email: string;
}
```

This is fine, but if we wanted to create a function that works with both User and UserWithEmail, we would typically have to write separate functions for each case. But we can improve this by using Generics.

### Using Generics to Handle Different Types

Let’s define a generic function that can handle different types of user data. Here’s how we might do it:

```tsx
function displayUserInfo<T extends User>(user: T): void {
  console.log(`Name: ${user.name}`);
  console.log(`Age: ${user.age}`);
  if ("email" in user) {
    console.log(`Email: ${(user as UserWithEmail).email}`);
  }
}
```

In this function, `T` is a placeholder for the type of the user object. When we call the function, TypeScript will automatically infer the type based on the argument passed.

### How Does This Work?

When we call the `displayUserInfo` function, TypeScript automatically checks the type of the user and ensures that we only try to access properties that exist on that type.

For example:

```tsx
const user1: User = { name: "Alice", age: 30 };
const user2: UserWithEmail = { name: "Bob", age: 25, email: "bob@example.com" };

displayUserInfo(user1); // Works fine!
displayUserInfo(user2); // Works fine too!
```

### Handling Type Safety

The power of Generics comes into play here: instead of writing separate functions for each type (User and UserWithEmail), we can use a single, flexible function. But we still have type safety—if a property like email is not available on the user, TypeScript will give us an error when we try to access it, as shown below:

```tsx
const invalidUser = { name: "Charlie", age: 40 };
displayUserInfo(invalidUser); // Error: Property 'name' is missing in type '{}' but required in type 'User'.ts(2345)
```

This is one of the key benefits of using Generics—you get the flexibility of handling various types while keeping strong type safety throughout your application.

### More Complex Example: Generic Class for Storing Data

Let’s take this a step further and create a generic class that stores items. This can be useful in various scenarios, such as managing lists of users, products, or any other type of data.

```tsx
class DataStore<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  getItems(): T[] {
    return this.items;
  }
}
```

Now, we can create instances of `DataStore` for different types:

```tsx
const userStore = new DataStore<User>();
userStore.addItem({ name: "Alice", age: 30 });
console.log(userStore.getItems()); // [ { name: 'Alice', age: 30 } ]

const emailStore = new DataStore<UserWithEmail>();
emailStore.addItem({ name: "Bob", age: 25, email: "bob@example.com" });
console.log(emailStore.getItems()); // [ { name: 'Bob', age: 25, email: 'bob@example.com' } ]
```

With the `DataStore<T>` class, you can manage a list of items of any type without duplicating code for each type. The `T` in the class acts as a placeholder for any type, which is defined when you create an instance of the class.

### Generic Constraints

Sometimes, you may want to restrict the types that can be used with a Generic. For instance, you might want to ensure that the data passed into the generic function or class has certain properties.

For example, let’s create a function that ensures the object passed has a `name` property:

```tsx
function greetUser<T extends { name: string }>(user: T): void {
  console.log(`Hello, ${user.name}!`);
}
```

In this case, the type T is constrained to only types that have a name property. If you try to pass an object without a name, TypeScript will show an error:

```tsx
const userWithName = { name: "Alice", age: 30 };
greetUser(userWithName); // Works fine!

const userWithoutName = { age: 40 };
greetUser(userWithoutName); // Error: Argument of type '{ age: number; }' is not assignable to parameter of type '{ name: string; }'.
```

### Generic Component in React Native: Rendering a List with FlatList

One of the best ways to utilize Generics in React Native is to create a component that can render a list of any type using FlatList. This is especially useful when you have a list of items that can vary in type (e.g., a list of users, products, or messages).

Here’s an example of a reusable `ListDisplay` component that works with any type of data:

```tsx
import React from "react";
import { FlatList, Text, View } from "react-native";

// Define a generic type for the ListDisplay component
type ListDisplayProps<T> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
};

const ListDisplay = <T extends { id: string }>({
  data,
  renderItem,
}: ListDisplayProps<T>) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <View>{renderItem(item)}</View>}
    />
  );
};

export default ListDisplay;
```

### How to Use the ListDisplay Component

Now, let's say you want to display a list of users. You can create a list of `User` objects and pass it to the `ListDisplay` component, providing a `renderItem` function to define how each user should be displayed:

```tsx
const users = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 40 },
];

const renderUser = (user: User) => (
  <Text>{`${user.name}, Age: ${user.age}`}</Text>
);

// Using the generic ListDisplay component with User data
<ListDisplay data={users} renderItem={renderUser} />
You can also use ListDisplay to render a list of products or any other type by simply passing the appropriate data and renderItem function.
```

Example with Products:

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Smartphone", price: 800 },
  { id: "3", name: "Headphones", price: 150 },
];

const renderProduct = (product: Product) => (
  <Text>{`${product.name} - $${product.price}`}</Text>
);

// Using the generic ListDisplay component with Product data
<ListDisplay data={products} renderItem={renderProduct} />;
```

### Conclusion

Generics in TypeScript allow you to write flexible, reusable, and type-safe code. By using Generics, you can create functions, classes, and even components like ListDisplay that work with any type while maintaining strong type safety throughout your application. Whether you're building a React Native app or working on backend logic, understanding how to use Generics can help you write cleaner and more maintainable code.

Thank you for reading! I hope this article helped you understand how to use Generics in TypeScript. Happy coding!

For reference:
[TypeScript Generics Documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html)
