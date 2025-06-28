---
title: "Pagination in React Native: useQuery vs useInfiniteQuery"
description: "Handling paginated lists in React Native using TanStack Query (React Query). A comparison between useQuery and useInfiniteQuery."
pubDate: "Jun 28 2025"
heroImage: "/tan-stack.png"
---

Before we dive into pagination strategies, let’s quickly set up our environment.

To follow along, make sure you have a working React Native environment. You can start a fresh project using:

```bash
npx @react-native-community/cli@latest init AwesomeProject
```

Then install the necessary dependencies:

```bash
npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query
```

React Query will handle the API requests, caching, and pagination logic, while the ESLint plugin helps catch common issues and enforce best practices during development.

Now let’s explore the problem of paginated data, and how we can tackle it the right way.

## The Problem: Handling Paginated Data in React Native

In many mobile apps, we often need to display large lists of items, users, posts, characters, products, etc. Since loading everything at once can hurt performance and user experience, **pagination** becomes necessary.

In a React Native context, it's common to use a `FlatList` and load more data when the user scrolls to the bottom. But how do we manage that data properly with **TanStack Query (React Query)**?

Today we’ll compare two approaches:

1. Using `useQuery` with manual pagination logic
2. Using `useInfiniteQuery`, which is designed for this exact use case

In this post we're going to use a [Rick and Morty API](https://rickandmortyapi.com/) as our data source.

Our goal is simple:

**Display a list of characters showing their names and pictures** using a paginated API and `FlatList`.

This is a great use case to explore both `useQuery` and `useInfiniteQuery` in practice.

Let’s jump in.

---

### TL;DR

- If you're just fetching a single set of data or manually handling pagination, `useQuery` works fine.
- But if you're implementing **infinite scroll**, `useInfiniteQuery` is almost always the better choice: it simplifies your code, handles the edge cases for you, and leads to cleaner components.

---

## First Solution: Using `useQuery` (Manual Pagination)

At first glance, it might seem like you can just change the page number and refetch the data using `useQuery`. And yes, it works, but you’ll have to handle _a lot_ of things yourself:

- Tracking the current page manually
- Storing all previously fetched items
- Merging results across pages
- Checking if there's a next page

Here's what it looks like:

```tsx
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

type Character = {
  id: number;
  name: string;
  image: string;
};

type APIResponse = {
  info: { next: string | null };
  results: Character[];
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchCharacters = async (page: number): Promise<APIResponse> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?page=${page}`,
  );
  if (!response.ok) {
    throw new Error("Error when fetching characters");
  }
  const data = await response.json();
  await delay(800);
  return data;
};

export function UseQueryCharacterList() {
  const [page, setPage] = useState(1);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["characters", page],
    queryFn: () => fetchCharacters(page),
  });

  useEffect(() => {
    if (data) {
      setAllCharacters((prev) =>
        page === 1 ? data.results : [...prev, ...data.results],
      );
      setHasNextPage(Boolean(data.info.next));
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (!isFetching && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <FlatList
      data={allCharacters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.characterContainer}>
          <Image source={{ uri: item.image }} style={styles.characterImage} />
          <Text>{item.name}</Text>
        </View>
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetching ? <ActivityIndicator size="large" /> : null
      }
      ListEmptyComponent={isLoading ? <ActivityIndicator size="large" /> : null}
    />
  );
}

const styles = StyleSheet.create({
  characterContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
```

This component uses the classic `useQuery` to fetch data from the Rick and Morty API. Every time a new page is needed, we manually keep track of the current page and update the query to fetch the next set of characters.

It renders a `FlatList` of characters and appends more items when reaching the end of the list, but since `useQuery` is not designed for infinite scroll, we need to handle things like pagination state and data merging ourselves.

I did include a small delay function, but it's only there to slow things down a bit for the sake of this tutorial, just to make the upcoming GIFs easier to follow. Don’t worry, the `useInfiniteQuery` example uses it too.

### ⚠️ Downsides of this approach

- More boilerplate
- Harder to maintain
- Prone to bugs when merging pages
- Requires manually managing page state and list state

![useQuery example](/use-query-example.gif)
![useQuery profiler](/use-query-profiler.png)

Let’s see how the same functionality looks with `useInfiniteQuery`, and also compare their performance using the React Profiler.

## Second Solution: Using `useInfiniteQuery` (Built-in Pagination)

Now here’s how the same problem is solved using `useInfiniteQuery`, which was **made** for this:

```tsx
import React from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

type Character = {
  id: number;
  name: string;
  image: string;
};

type APIResponse = {
  info: { next: string | null };
  results: Character[];
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchCharacters = async ({ pageParam = 1 }): Promise<APIResponse> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?page=${pageParam}`,
  );
  if (!response.ok) {
    throw new Error("Error when fetching characters");
  }
  const data = await response.json();
  await delay(800);

  return data;
};

export function UseInfiniteQueryCharacterList() {
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["characters"],
      queryFn: fetchCharacters,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const nextUrl = lastPage.info.next;
        if (!nextUrl) return undefined;
        const url = new URL(nextUrl);
        const pageParam = url.searchParams.get("page");
        return pageParam ? parseInt(pageParam, 10) : undefined;
      },
    });

  const characters = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <FlatList
      data={characters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.characterContainer}>
          <Image source={{ uri: item.image }} style={styles.characterImage} />
          <Text>{item.name}</Text>
        </View>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetching || isFetchingNextPage ? (
          <ActivityIndicator size="large" />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  characterContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
```

Compared to the previous version, a few things stand out immediately:

- ✅ **No need for `useState` or `useEffect`** to manage page state.
- ✅ **No manual tracking** of the current page or merging of data.
- ✅ `useInfiniteQuery` handles all of that internally, and provides helpers like `fetchNextPage` and `hasNextPage`.

Because `useInfiniteQuery` returns the results in **pages** (each page being an API response), we just need to `flatMap` all results into a single array to feed into `FlatList`.

This structure makes the component **simpler, cleaner, and easier to reason about**, especially when working with paginated APIs.

![useInfiniteQuery example](/use-infinite-query-example.gif)
![useInfiniteQuery profiler](/use-infinite-query-profiler.png)

## Conclusion

If you’re implementing infinite scroll in React Native, **prefer `useInfiniteQuery` over `useQuery`**. It simplifies logic, reduces bugs, and makes your components easier to reason about.

While `useQuery` technically works, it quickly becomes verbose and error-prone. When the goal is to fetch more data as the user scrolls, `useInfiniteQuery` was built for the job.

Choose the right tool for the right scenario, and keep your scroll smooth. 🚀

Thanks for reading until the end!
