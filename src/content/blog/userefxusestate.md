---
title: "useRef x useState in React Native"
description: ""
pubDate: "Feb 01 2025"
heroImage: "/react_native.png"
---

React Native allows developers to build mobile applications using React, which makes it a powerful tool for creating cross-platform apps. Just like in React for the web, React Native offers hooks such as `useRef` and `useState` to manage state and references. However, understanding when and why to use one over the other can sometimes be tricky, especially when you’re working with mobile-specific behaviors and performance considerations.

In this article, we'll explore the key differences between `useRef` and `useState` in <strong class="dark:text-white">React Native</strong>, and discuss their advantages and disadvantages to help you make the best choice for your projects.

To follow along, we'll use <strong class="dark:text-white">Expo</strong> to create our React Native application. You can create the app by running `npx create-expo-app@latest` on your terminal and naming the project `userefxusestate`.

Next, we'll remove all content from the home screen and dive into our study, starting with `useState`.

<h3 class="dark:text-white">What is useState?</h3>

`useState` is a hook that lets you add state to your functional components. When the state changes, the component re-renders to reflect the updated state. This makes `useState` essential for handling user interactions, fetching data, or any situation where you need to trigger a re-render based on state changes.

Let's create a button that increments a counter, starting at 0:

```tsx
import { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  const handleOnPress = () => {
    setCount(count + 1);
  };

  console.log("re-render");

  return (
    <View style={styles.container}>
      <Button title="Increment" onPress={handleOnPress} />
      <Text>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
```

In the example above, `count` is a piece of state that triggers a re-render of the component every time its value changes. Each time you call `setCount`, the component re-renders with the updated value.

Notice that every time I click the increment button, a new re-render log occurs.

<img src="/use-state-example.gif" />

But this <strong class="dark:text-white">won’t happen</strong> when we use `useRef`!

<h3 class="dark:text-white">What is useRef?</h3>

`useRef` is a hook that creates a mutable object that persists for the lifetime of the component. The value stored in a ref doesn’t trigger a re-render when changed. This makes it ideal for storing values that shouldn’t cause a re-render, such as DOM references, timers, or any mutable data that doesn’t affect the UI.

Let's look at the same example using `useRef` and see the behavior:

```tsx
import { useRef } from "react";
import { StyleSheet, View, Button, Text } from "react-native";

export default function HomeScreen() {
  const count = useRef(0);

  const handleOnPress = () => {
    count.current += 1;
    console.log("Current Count:", count.current);
  };

  console.log("re-render");

  return (
    <View style={styles.container}>
      <Button title="Increment" onPress={handleOnPress} />
      <Text>{count.current}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
```

In this version, I added a log in the `handleOnPress` function to display the current count.

Notice how the screen doesn't change! Even though the ref is being updated, it <strong class="dark:text-white">doesn’t cause a re-render</strong>, because `useRef` doesn’t trigger one when the value of `count.current` changes.

<img src="/use-ref-example.gif" />

Now, let's look at an example where using `useRef` makes more sense.

<h3 class="dark:text-white">Using useRef for Timer Logic</h3>

Consider the following example, where we use `useRef` to manage a timer:

```tsx
import { useRef } from "react";
import { StyleSheet, Button, View } from "react-native";

export default function HomeScreen() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  console.log("re-render");

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      console.log("Timer is running...");
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      console.log("Timer stopped.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Timer" onPress={startTimer} />
      <Button title="Stop Timer" onPress={stopTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
```

In this example, `timerRef` stores a reference to the timer interval. Changing `timerRef.current` doesn’t trigger a re-render, which is exactly what we want for non-UI-related logic like timers or external integrations.

<img src="/use-ref-example-2.gif" />

Now, let’s look at the behavior using `useState`.

<h3 class="dark:text-white">Using useState for Timer Logic</h3>

```tsx
import { useState } from "react";
import { StyleSheet, Button, View } from "react-native";

export default function HomeScreen() {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  console.log("re-render");

  const startTimer = () => {
    const id = setInterval(() => {
      console.log("Timer is running...");
    }, 1000);
    setTimer(id);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      console.log("Timer stopped.");
      setTimer(null);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Timer" onPress={startTimer} />
      <Button title="Stop Timer" onPress={stopTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
```

<img src="/use-state-example-2.gif" />

Here, by using `useState`, we trigger two unnecessary re-renders: one for setting the interval, and one for clearing it. In total, that’s two more re-renders, compared to when using `useRef`. If we look from another perspective, that's three times more re-renders, considering the first re-render always happens when then screen is mounted.

---

<h3 class="dark:text-white">Key Differences Between useState and useRef</h3>

| <span class="dark:text-white">Aspect</span>                 | `useState`                                         | `useRef`                                                                  |
| ----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| <strong class="dark:text-white">Purpose</strong>            | Stores state that triggers re-renders.             | Stores mutable values that don’t trigger re-renders.                      |
| <strong class="dark:text-white">Triggers Re-render</strong> | Yes, any change to the state triggers a re-render. | No, changing `ref.current` doesn’t trigger re-renders.                    |
| <strong class="dark:text-white">Use Case</strong>           | For UI-related state that affects rendering.       | For values or references (like DOM elements) that don’t affect rendering. |
| <strong class="dark:text-white">Example Use</strong>        | Form inputs, counters, toggles, etc.               | Timer references, external libraries, DOM element references.             |

---

<h3 class="dark:text-white">When to use useState</h3>

Use `useState` when you need to track and update values that affect your component's output. This could be anything from form inputs to counters or data fetched from an API.

<h3 class="dark:text-white">When to use useRef</h3>

On the other hand, use `useRef` when you need to store a reference to a DOM element (in React Native, this might be a View, for instance) or a value that persists across renders without causing re-renders. It's ideal for scenarios like managing timers, storing previous state values, or accessing mutable objects (such as third-party libraries).

<h3 class="dark:text-white">Conclusion</h3>

Both `useRef` and `useState` are powerful hooks for managing state and references in React Native apps. The key takeaway is that `useState` is best for values that need to trigger re-renders when updated, while `useRef` is perfect for values that persist without causing unnecessary renders.

By understanding the differences between these two hooks, you can write more efficient and performant React Native code!
