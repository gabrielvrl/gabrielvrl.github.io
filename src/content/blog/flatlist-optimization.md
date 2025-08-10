---
title: "Large List Optimization Techniques with FlatList in React Native"
description: "Large List Optimization Techniques with FlatList in React Native"
pubDate: "Aug 10 2025"
heroImage: "/react_native.png"
---

## **Introduction**

As React Native developers, we don’t always have full control over how APIs deliver data.

Sometimes, we have to work with **endpoints that are not paginated**, which means they return massive lists all at once.

When that happens, simply rendering the list with a `FlatList` can quickly become a performance bottleneck, leading to sluggish scrolling, UI freezes and excessive memory usage.

The problem is even more noticeable on lower-end devices, where CPU and memory resources are more limited.

If you want to deliver a **smooth user experience** for everyone, optimizing list rendering is not just a nice-to-have. It’s a must.

In this article, we’ll cover:

- The common performance issues that arise when dealing with large lists in React Native.
- A simple example of an **unoptimized FlatList** implementation (our starting point).
- Practical techniques and configuration tweaks to **optimize FlatList** for better performance.

Let’s start by building a basic, unoptimized list that simulates a non-paginated API response. This will give us a baseline to work from before we apply any optimizations.

## Starting with a basic implementation

To simulate a real-world scenario where we fetch a large dataset from a non-paginated API, let’s start with a simple `FlatList` implementation.

In this example, we’re mocking a network request that returns a static list of 100 generic data items. Each item is rendered with a basic `View` and `Text` component.

```tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DataProps = {
  id: string;
  name: string;
};

function App() {
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
    }));
    setData(mockData);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
```

![Flatlist Optimization Starting point gif](/flatlist-optimization-starting-point.gif)

### **Why this can become a problem**

While this implementation works fine for small datasets, it can struggle with large lists due to:

- **Inline `renderItem`** — recreated on every render, forcing unnecessary re-renders.
- **No memoization** — items are not wrapped in `React.memo` or similar techniques.
- **No `getItemLayout`** — FlatList has to calculate item positions dynamically.
- **Default render settings** — `initialNumToRender`, `maxToRenderPerBatch`, and `windowSize` are not tuned.
- **Using the list index as a key** — `keyExtractor={(item, index) => index.toString()}` can cause rendering issues when the data changes (items can be reused incorrectly, leading to flickering or mismatched data).

When you scale this from 100 items to 5,000 items, you’ll notice slower scrolling and higher memory usage.

## Step 1: Memoize Your Item Renderer

One of the simplest yet most effective optimizations you can apply to your `FlatList` is to **memoize the item renderer**.

### Why memoize `renderItem`?

When you define `renderItem` inline (directly inside the JSX), React creates a new function on every render. This causes `FlatList` to think the list items need to be re-rendered, even if the data hasn’t changed.

### How to fix it:

1. Extract the item UI into a separate component.
2. Wrap that component with `React.memo` so it only re-renders if its props change.
3. Use `useCallback` to memoize the `renderItem` function, so its reference stays the same between renders.

```tsx
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DataProps = {
  id: string;
  name: string;
};

const ListItem = memo(({ item }: { item: DataProps }) => (
  <View style={styles.listItem}>
    <Text>{item.name}</Text>
  </View>
));

function App() {
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
    }));
    setData(mockData);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: DataProps }) => <ListItem item={item} />,
    [],
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
```

## Step 2: Use a stable keyExtractor

Before jumping into deeper performance tricks, let’s fix a common issue that can cause subtle bugs and unnecessary re-renders: the `keyExtractor`.

Using the array index as the key is easy but problematic:

```tsx
// ❌ Avoid this!
keyExtractor={(item, index) => index.toString()}
```

Why? Because when the list data changes (items added, removed, or reordered), React Native reuses components based on the key. If the key is the index, it can cause UI glitches, flickering, or wrong item data shown.

**Solution:** use a unique and stable id from your data:

```tsx
// ✅ Better
keyExtractor={item => item.id}
```

This helps React correctly track which items changed and optimize rendering.

## Step 3: Use getItemLayout for fixed-height rows

If your list items have a fixed height (or at least you know their height in advance), implementing `getItemLayout` helps `FlatList` calculate positions without measuring each item dynamically.

This significantly improves scroll performance, especially on large lists, because the system knows exactly where to scroll without layout calculations.

Example: if each item height is 61px (including any margin/border):

```tsx
getItemLayout={(_, index) => ({
  length: 61,
  offset: 61 * index,
  index,
})}

```

Add this prop to your `FlatList` to boost scroll smoothness.

## Step 4: Tune initialNumToRender, maxToRenderPerBatch, and windowSize

`FlatList` has some props controlling how many items it renders initially and during scrolling:

- `initialNumToRender`: how many items are rendered at first (default 10)
- `maxToRenderPerBatch`: max items rendered per batch during scroll (default 10)
- `windowSize`: number of viewports worth of items rendered (default 21)

For large lists, tweaking these values can make a big difference:

- Decrease `initialNumToRender` to reduce startup rendering cost
- Adjust `maxToRenderPerBatch` to balance CPU usage and smoothness
- Reduce `windowSize` to minimize offscreen rendering, but don’t make it too small or you get blank areas while scrolling

Example:

```tsx
<FlatList
  ...
  initialNumToRender={5}
  maxToRenderPerBatch={5}
  windowSize={10}
/>

```

## Step 5: Use removeClippedSubviews for memory optimization

Setting `removeClippedSubviews={true}` can help reduce memory usage by unmounting components that are outside the viewport. This is especially useful on Android where memory pressure can be higher.

But be careful! Sometimes it causes issues with animations or complex layouts, so test thoroughly!

With these optimizations in mind, here's an example of how your code could be structured incorporating these techniques.

```tsx
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DataProps = {
  id: string;
  name: string;
};

const ListItem = memo(({ item }: { item: DataProps }) => (
  <View style={styles.listItem}>
    <Text>{item.name}</Text>
  </View>
));

function App() {
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
    }));
    setData(mockData);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: DataProps }) => <ListItem item={item} />,
    [],
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        getItemLayout={(_, index) => ({
          length: 61,
          offset: 61 * index,
          index,
        })}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
```

## Step 6: Implement Virtualization and Pagination

When working with very large datasets, loading and rendering all items at once, even with optimizations, can still hurt performance and user experience. That’s where **virtualization** and **pagination** come in.

### What is Virtualization?

React Native’s `FlatList` already does virtualization under the hood, meaning it renders only the visible items plus a small buffer instead of the entire list at once. This keeps memory usage and rendering cost low.

However, virtualization is only effective if you **don’t load all data upfront**. Loading thousands of items into state at once defeats this purpose.

### Why Pagination?

Many APIs support fetching data in chunks or “pages.” If your API doesn’t support this, you can simulate pagination on the client by:

- Initially loading a smaller subset of the data.
- Loading more items as the user scrolls near the bottom (infinite scroll).

### How to Implement Pagination with FlatList

Use FlatList’s `onEndReached` and `onEndReachedThreshold` props to detect when the user is close to the end, and then fetch/load more data.

```tsx
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DataProps = {
  id: string;
  name: string;
};

const ListItem = memo(({ item }: { item: DataProps }) => (
  <View style={styles.listItem}>
    <Text>{item.name}</Text>
  </View>
));

const ListFooter = memo(({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color="#999" />
      <Text style={styles.footerText}>Loading more...</Text>
    </View>
  );
});

function App() {
  const [data, setData] = useState<DataProps[]>([]);
  const [allData, setAllData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 20;
  const TOTAL_ITEMS = 1000;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockAllData = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
    }));

    setAllData(mockAllData);
    setData(mockAllData.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setLoading(false);
  };

  const loadMoreData = async () => {
    if (loadingMore || data.length >= allData.length) return;

    setLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = allData.slice(startIndex, endIndex);

    setData((prevData) => [...prevData, ...newItems]);
    setCurrentPage(nextPage);
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: DataProps }) => <ListItem item={item} />,
    [],
  );

  const renderFooter = useCallback(
    () => <ListFooter isLoading={loadingMore} />,
    [loadingMore],
  );

  const handleEndReached = () => {
    if (!loadingMore && data.length < allData.length) {
      loadMoreData();
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        getItemLayout={(_, index) => ({
          length: 61,
          offset: 61 * index,
          index,
        })}
        maxToRenderPerBatch={5}
        initialNumToRender={15}
        windowSize={10}
        removeClippedSubviews={true}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#999",
  },
});

export default App;
```

![Flatlist Optimization Final Version gif](/flatlist-optimization-final-version.gif)

### Why it matters?

- Avoids loading all data at once, reducing initial load time and memory footprint.
- Improves responsiveness by chunking data requests and rendering.
- Provides a better UX with infinite scroll or “load more” functionality.

## Conclusion

Optimizing large lists in React Native can drastically improve your app’s performance and user experience. By applying techniques such as memoizing your item components, using stable keys, leveraging `getItemLayout`, tuning rendering batch sizes, and implementing pagination with virtualization, you ensure smooth scrolling and efficient rendering, even with thousands of items.

Remember, every app and dataset is unique, so always measure performance and profile your lists to identify bottlenecks specific to your case.

Feel free to experiment with these strategies and adapt them to your project’s needs. If you found this post helpful, share it with your developer friends and let me know what optimizations have worked best for you!
