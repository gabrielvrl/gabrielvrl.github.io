---
title: "Técnicas de Otimização para Listas Grandes com FlatList no React Native"
description: "Técnicas de Otimização para Listas Grandes com FlatList no React Native"
pubDate: "Aug 10 2025"
heroImage: "/react_native.png"
---

## **Introdução**

Como desenvolvedores React Native, nem sempre temos controle total sobre como as APIs entregam dados.

Às vezes, precisamos trabalhar com **endpoints que não são paginados**, o que significa que eles podem retornar listas enormes de uma vez só.

Quando isso acontece, simplesmente renderizar a lista com uma `FlatList` pode rapidamente se tornar um gargalo de performance, causando scroll travado, travamentos na UI e uso excessivo de memória.

O problema fica ainda mais perceptível em dispositivos mais simples, onde os recursos de CPU e memória são mais limitados.

Se você quer entregar uma **experiência de usuário fluida** para todo mundo, otimizar a renderização de listas não é apenas um "seria legal ter". É obrigatório.

Neste artigo, vamos cobrir:

- Os problemas comuns de performance que surgem ao lidar com listas grandes no React Native.
- Um exemplo simples de implementação **não otimizada de FlatList** (nosso ponto de partida).
- Técnicas práticas e ajustes de configuração para **otimizar FlatList** para melhor performance.

Vamos começar construindo uma lista básica e não otimizada que simula uma resposta de API não paginada. Isso nos dará uma base para trabalhar antes de aplicarmos qualquer otimização.

## Começando com uma implementação básica

Para simular um cenário real onde buscamos um dataset grande de uma API não paginada, vamos começar com uma implementação simples de `FlatList`.

Neste exemplo, estamos simulando uma requisição à API que retorna uma lista estática de 100 itens de dados genéricos. Cada item é renderizado com componentes básicos `View` e `Text`.

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

### **Por que isso pode se tornar um problema**

Embora essa implementação funcione bem para datasets pequenos, ela pode ter dificuldades com listas grandes devido a:

- **`renderItem` inline** — recriado a cada render, forçando re-renders desnecessários.
- **Sem memoização** — itens não são envolvidos em `React.memo` ou técnicas similares.
- **Sem `getItemLayout`** — FlatList tem que calcular posições de itens dinamicamente.
- **Configurações padrão de render** — `initialNumToRender`, `maxToRenderPerBatch`, e `windowSize` não estão ajustados.
- **Usando o índice da lista como chave** — `keyExtractor={(item, index) => index.toString()}` pode causar problemas de renderização quando os dados mudam (itens podem ser reutilizados incorretamente, causando piscadas na tela ou dados incompatíveis).

Quando você escala isso de 100 itens para 5.000 itens, você vai notar scroll mais lento e maior uso de memória.

## Passo 1: Memoize Seu Renderizador de Item

Uma das otimizações mais simples mas efetivas que você pode aplicar à sua `FlatList` é **memoizar o renderizador de item**.

### Por que memoizar `renderItem`?

Quando você define `renderItem` inline (diretamente dentro do JSX), o React cria uma nova função a cada render. Isso faz com que a `FlatList` pense que os itens da lista precisam ser re-renderizados, mesmo se os dados não mudaram.

### Como corrigir:

1. Extraia a UI do item para um componente separado.
2. Envolva esse componente com `React.memo` para que ele só re-renderize se suas props mudarem.
3. Use `useCallback` para memoizar a função `renderItem`, para que sua referência permaneça a mesma entre renders.

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

## Passo 2: Use um keyExtractor estável

Antes de partir para truques de performance mais profundos, vamos corrigir um problema comum que pode causar bugs sutis e re-renders desnecessários: o `keyExtractor`.

Usar o índice do array como chave é fácil, mas problemático

```tsx
// ❌ Evite isso!
keyExtractor={(item, index) => index.toString()}
```

Por quê? Porque quando os dados da lista mudam (itens adicionados, removidos ou reordenados), o React Native reutiliza componentes baseado na chave. Se a chave é o índice, pode causar problemas visuais, piscadas ou dados errados sendo mostrados.

**Solução:** use um id único e estável dos seus dados:

```tsx
// ✅ Melhor
keyExtractor={item => item.id}
```

Isso ajuda o React a rastrear corretamente quais itens mudaram e otimizar a renderização.

## Passo 3: Use getItemLayout para linhas de altura fixa

Se os itens da sua lista têm altura fixa (ou pelo menos você sabe a altura deles antecipadamente), implementar `getItemLayout` ajuda a `FlatList` a calcular posições sem medir cada item dinamicamente.

Isso melhora significativamente a performance do scroll, especialmente em listas grandes, porque o sistema sabe exatamente onde fazer scroll sem cálculos de layout.

Exemplo: se cada item tem altura de 61px (incluindo margem/borda):

```tsx
getItemLayout={(_, index) => ({
  length: 61,
  offset: 61 * index,
  index,
})}

```

Adicione essa prop à sua `FlatList` para melhorar a suavidade do scroll.

## Passo 4: Ajuste initialNumToRender, maxToRenderPerBatch e windowSize

`FlatList` tem algumas props que controlam quantos itens ela renderiza inicialmente e durante o scroll:

- `initialNumToRender`: quantos itens são renderizados no início (padrão 10)
- `maxToRenderPerBatch`: máximo de itens renderizados por lote durante o scroll (padrão 10)
- `windowSize`: número de viewports de itens renderizados (padrão 21)

Para listas grandes, ajustar esses valores pode fazer uma grande diferença:

- Diminua `initialNumToRender` para reduzir o custo de renderização inicial
- Ajuste `maxToRenderPerBatch` para balancear uso de CPU e suavidade
- Reduza `windowSize` para minimizar renderização fora da tela, mas não torne muito pequeno ou você terá áreas em branco durante o scroll

Exemplo:

```tsx
<FlatList
  ...
  initialNumToRender={5}
  maxToRenderPerBatch={5}
  windowSize={10}
/>

```

## Passo 5: Use removeClippedSubviews para otimização de memória

Definir `removeClippedSubviews={true}` pode ajudar a reduzir o uso de memória ao desmontar componentes que estão fora do viewport. Isso é especialmente útil no Android onde as limitações de memória podem ser maior.

Mas cuidado! Às vezes causa problemas com animações ou layouts complexos, então teste bem!

Com essas otimizações em mente, aqui está um exemplo de como seu código poderia ser estruturado incorporando essas técnicas.

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

## Passo 6: Implemente Virtualização e Paginação

Ao trabalhar com datasets muito grandes, carregar e renderizar todos os itens de uma vez, mesmo com otimizações, ainda pode prejudicar a performance e experiência do usuário. É aí que entram a **virtualização** e **paginação**.

### O que é Virtualização?

A `FlatList` do React Native já faz virtualização por baixo dos panos, ou seja, ela renderiza apenas os itens visíveis mais um pequeno buffer ao invés da lista inteira de uma vez. Isso mantém o uso de memória e custo de renderização baixos.

No entanto, a virtualização só é efetiva se você **não carregar todos os dados de uma vez**. Carregar milhares de itens no state de uma vez derrota esse propósito.

### Por que Paginação?

Muitas APIs suportam buscar dados em pedaços ou "páginas". Se sua API não suporta isso, você pode simular paginação no cliente:

- Inicialmente carregando um subconjunto menor dos dados.
- Carregando mais itens conforme o usuário faz scroll perto do final (scroll infinito).

### Como Implementar Paginação com FlatList

Use as props `onEndReached` e `onEndReachedThreshold` da FlatList para detectar quando o usuário está perto do final, e então busque/carregue mais dados.

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

### Por que isso é importante?

- Evita carregar todos os dados de uma vez, reduzindo tempo de carregamento inicial e uso de memória.
- Melhora a responsividade dividindo requisições de dados e renderização em pedaços.
- Oferece uma melhor UX com scroll infinito ou funcionalidade "carregar mais".

## Conclusão

Otimizar listas grandes no React Native pode melhorar drasticamente a performance e experiência do usuário do seu app. Aplicando técnicas como memoizar seus componentes de item, usar chaves estáveis, aproveitar `getItemLayout`, ajustar tamanhos de lotes de renderização, e implementar paginação com virtualização, você garante scroll suave e renderização eficiente, mesmo com milhares de itens.

Lembre-se, cada app e dataset é único, então sempre meça a performance e faça profiling das suas listas para identificar gargalos específicos do seu caso.

Sinta-se livre para experimentar com essas estratégias e adaptá-las às necessidades do seu projeto. Se achou este post útil, compartilhe com seus amigos desenvolvedores e me conte quais otimizações funcionaram melhor para você!
