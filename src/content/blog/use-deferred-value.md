---
title: "Improving Performance in React Native with useDeferredValue"
description: "Improving Performance in React Native with useDeferredValue"
pubDate: "Jun 14 2025"
heroImage: "/react_native.png"
---

## The problem

A very common challenge for front-end developers, whether mobile or web, is dealing with searches in large lists, especially dynamically, without having a button that the user clicks to perform the search. Check out the following code and its behavior:

Brief explanation about the code: Here we have a `query` state that will control the rendering of the filtered FlatList. We also use a `busy wait` technique with a `while` loop just to occupy CPU processing, since our list of movies is just a mocked array and not actually an API call.

```tsx
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const movies = [
  "The Godfather",
  "Fight Club",
  "Pulp Fiction",
  "The Lord of the Rings",
  "The Matrix",
  "Interstellar",
  "Inception",
  "Titanic",
  "Forrest Gump",
  "Gladiator",
  "The Avengers",
  "Black Panther",
  "The Lion King",
  "Toy Story",
  "Joker",
  "Avatar",
  "Top Gun: Maverick",
  "Spider-Man: No Way Home",
  "Dune",
  "Barbie",
  "Oppenheimer",
  "Frozen",
  "Inside Out",
  "Soul",
  "Ratatouille",
];

function App(): React.JSX.Element {
  const [query, setQuery] = useState("");

  console.log("App rendered with query:", query);

  const filteredMovies = () => {
    const now = Date.now();
    while (Date.now() - now < 1000) {}
    return movies.filter((title) =>
      title.toLowerCase().includes(query.toLowerCase()),
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search film"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredMovies()}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  item: {
    fontSize: 18,
    paddingVertical: 6,
  },
  mt20: {
    marginTop: 20,
  },
});

export default App;
```

![Only useState](/use-state-with-flat-list.gif)

![Profiler only useState](/profiler-use-state-with-flat-list.png)

We can observe that there is a “heavy” re-render of approximately 1000ms for each letter typed, because in addition to the `query` state being updated, which naturally triggers a new re-render, the flat list is also re-rendered on every keystroke. This can be very costly if your user's device is not very powerful.

## Solution 1 - debounce

A very common solution that developers have used over the years, and is still valid, is to create a `debounce`, a technique that delays the execution of a function by `x` milliseconds.

However, in scenarios where we don't want to block the UI but rather let React prioritize more important tasks in the background, debounce may not be the best solution.

### ⚠️ The problem with fixed debounce

Using a fixed value like `300ms` might seem safe, but:

- ⚡ **On fast devices**, you might be **unnecessarily delaying** the update.
- 🐢 **On slow devices**, 300ms **might not be enough**. Rendering can still freeze because React is already trying to recalculate while the CPU is still handling other tasks.

In other words: **a fixed number does not adapt to the user's context**.

## Solution 2 - useDeferredValue

The React team introduced in [React 18](https://github.com/facebook/react/releases/tag/v18.0.0) a hook called `useDeferredValue`, which, according to the official React definition:

> useDeferredValue lets you defer re-rendering a non-urgent part of the tree. It is similar to debouncing, but has a few advantages compared to it. There is no fixed time delay, so React will attempt the deferred render right after the first render is reflected on the screen. The deferred render is interruptible and doesn't block user input.

With that in mind, let's look at an example using `useDeferredValue` instead of `query` for filtering the movies:

```tsx
import React, { useDeferredValue, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const movies = [
  "The Godfather",
  "Fight Club",
  "Pulp Fiction",
  "The Lord of the Rings",
  "The Matrix",
  "Interstellar",
  "Inception",
  "Titanic",
  "Forrest Gump",
  "Gladiator",
  "The Avengers",
  "Black Panther",
  "The Lion King",
  "Toy Story",
  "Joker",
  "Avatar",
  "Top Gun: Maverick",
  "Spider-Man: No Way Home",
  "Dune",
  "Barbie",
  "Oppenheimer",
  "Frozen",
  "Inside Out",
  "Soul",
  "Ratatouille",
];

function App(): React.JSX.Element {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  console.log("App rendered with query:", query);
  console.log("App rendered with deferredQuery:", deferredQuery);

  const filteredMovies = () => {
    const now = Date.now();
    while (Date.now() - now < 1000) {}
    return movies.filter((title) =>
      title.toLowerCase().includes(deferredQuery.toLowerCase()),
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search film"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredMovies()}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  item: {
    fontSize: 18,
    paddingVertical: 6,
  },
  mt20: {
    marginTop: 20,
  },
});

export default App;
```

![useState with useDeferredValue](/use-deferred-value-with-flat-list.gif)

![Profiler useState with useDefferedValue](/profiler-use-deferred-value-with-flat-list.png)

Notice that there is already an improvement in the experience: the flat list only changes when the value of `deferredQuery` changes. You can even add a loading component if the value of `query` is different from `deferredQuery`, indicating a loading state. But... we are still seeing large re-renders of approximately 1000ms. How can we solve this problem?

## Solution 3 - useDeferredValue + useMemo

Although we are using useDeferredValue, it **does not** block side effects, nor does it prevent API calls by itself. That said, we can combine its use with the `useMemo` hook.

Observe the behavior, the profiler, and the updated code below:

```tsx
import React, { useDeferredValue, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const movies = [
  "The Godfather",
  "Fight Club",
  "Pulp Fiction",
  "The Lord of the Rings",
  "The Matrix",
  "Interstellar",
  "Inception",
  "Titanic",
  "Forrest Gump",
  "Gladiator",
  "The Avengers",
  "Black Panther",
  "The Lion King",
  "Toy Story",
  "Joker",
  "Avatar",
  "Top Gun: Maverick",
  "Spider-Man: No Way Home",
  "Dune",
  "Barbie",
  "Oppenheimer",
  "Frozen",
  "Inside Out",
  "Soul",
  "Ratatouille",
];

function App(): React.JSX.Element {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  console.log("App rendered with query:", query);
  console.log("App rendered with deferredQuery:", deferredQuery);

  const filteredMovies = useMemo(() => {
    const now = Date.now();
    while (Date.now() - now < 1000) {}
    return movies.filter((title) =>
      title.toLowerCase().includes(deferredQuery.toLowerCase()),
    );
  }, [deferredQuery]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search film"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  item: {
    fontSize: 18,
    paddingVertical: 6,
  },
  mt20: {
    marginTop: 20,
  },
});

export default App;
```

![useDeferredValue with useMemo](/use-deferred-value-with-use-memo-with-flat-list.gif)

![Profiler useDeferredValue with useMemo](/profiler-use-deferred-value-with-use-memo-with-flat-list.png)

Notice that, although we have several commits in the profiler, the render times are minimal, around 10ms, compared to the previous 1000ms when the list was actually updated. This is an improvement of almost **99%**!

## Conclusion

Although `useDeferredValue` is a powerful tool to improve responsiveness in dynamic interfaces, **it is not a universal solution that solves all performance problems**. It works best in **specific cases**, such as:

- Heavy filtering or sorting based on user input;
- Interfaces with large lists that suffer from repeated renders;
- Avoiding immediate rendering of expensive components while typing.

However, **it is not ideal for every type of interaction**. Avoid using `useDeferredValue` when:

- The update needs to happen immediately (e.g., input masks, sensitive fields like SSN, ZIP code, monetary values);
- The data or action depends on precise synchronization with the input (e.g., real-time validation or interactions with instant feedback);
- The rendering cost is low and there is no perceptible impact on the experience.

In summary, `useDeferredValue` **should be applied with care**, prioritizing scenarios where rendering cost can affect UI smoothness. Use it as a way to improve **task prioritization**, not as a replacement for other good performance practices.

Thank you for reading!
