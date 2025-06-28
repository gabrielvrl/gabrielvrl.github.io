---
title: "Paginação no React Native: useQuery vs useInfiniteQuery"
description: "Lidando com listas paginadas no React Native usando TanStack Query (React Query). Uma comparação entre useQuery e useInfiniteQuery."
pubDate: "Jun 28 2025"
heroImage: "/tan-stack.png"
---

Antes de mergulharmos nas estratégias de paginação, vamos configurar rapidamente nosso ambiente.

Para acompanhar, certifique-se de ter um ambiente React Native funcionando. Você pode iniciar um novo projeto usando:

```bash
npx @react-native-community/cli@latest init AwesomeProject
```

Em seguida, instale as dependências necessárias:

```bash
npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query
```

O React Query cuidará das requisições da API, cache e lógica de paginação, enquanto o plugin ESLint ajuda a detectar problemas comuns e aplicar boas práticas durante o desenvolvimento.

Agora vamos explorar o problema de dados paginados e como podemos resolvê-lo da maneira certa.

## O Problema: Lidando com Dados Paginados no React Native

Em muitos aplicativos móveis, frequentemente precisamos exibir grandes listas de itens, usuários, posts, personagens, produtos, etc. Como carregar tudo de uma vez pode prejudicar a performance e experiência do usuário, a **paginação** se torna necessária.

No contexto do React Native, é comum usar uma `FlatList` e carregar mais dados quando o usuário faz scroll até o final. Mas como podemos gerenciar esses dados adequadamente com o **TanStack Query (React Query)**?

Hoje vamos comparar duas abordagens:

1. Usando `useQuery` com lógica de paginação manual
2. Usando `useInfiniteQuery`, que foi projetado exatamente para este caso de uso

Neste post vamos usar a [API do Rick and Morty](https://rickandmortyapi.com/) como nossa fonte de dados.

Nosso objetivo é simples:

**Exibir uma lista de personagens mostrando seus nomes e fotos** usando uma API paginada e uma `FlatList`.

Este é um ótimo caso de uso para explorar tanto `useQuery` quanto `useInfiniteQuery` na prática.

Vamos começar.

---

### TL;DR

- Se você está apenas buscando um único conjunto de dados ou lidando manualmente com paginação, `useQuery` funciona bem.
- Mas se você está implementando **scroll infinito**, `useInfiniteQuery` é quase sempre a melhor escolha: simplifica seu código, lida com os casos extremos para você e resulta em componentes mais limpos.

---

## Primeira Solução: Usando `useQuery` (Paginação Manual)

À primeira vista, pode parecer que você pode simplesmente alterar o número da página e refazer a busca dos dados usando `useQuery`. E sim, funciona, mas você terá que lidar com _muitas_ coisas manualmente:

- Rastrear a página atual manualmente
- Armazenar todos os itens buscados anteriormente
- Juntar resultados entre páginas
- Verificar se há uma próxima página

Veja como fica:

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

Este componente usa o `useQuery` clássico para buscar dados da API do Rick and Morty. Toda vez que uma nova página é necessária, rastreamos manualmente a página atual e atualizamos a query para buscar o próximo conjunto de personagens.

Ele renderiza uma `FlatList` de personagens e adiciona mais itens ao chegar ao final da lista, mas como `useQuery` não foi projetado para scroll infinito, precisamos lidar com coisas como estado de paginação e junção de dados nós mesmos.

Incluí uma pequena função de delay, mas ela está lá apenas para deixar as coisas um pouco mais lentas para este tutorial, apenas para tornar os GIFs mais fáceis de acompanhar. Não se preocupe, o exemplo com `useInfiniteQuery` também a usa.

### ⚠️ Desvantagens desta abordagem

- Mais código repetitivo
- Mais difícil de manter
- Propenso a bugs ao combinar páginas
- Requer gerenciamento manual do estado da página e do estado da lista

![exemplo useQuery](/use-query-example.gif)
![profiler useQuery](/use-query-profiler.png)

Vamos ver como a mesma funcionalidade fica com `useInfiniteQuery`, e também comparar sua performance usando o React Profiler.

## Segunda Solução: Usando `useInfiniteQuery` (Paginação Integrada)

Agora veja como o mesmo problema é resolvido usando `useInfiniteQuery`, que foi **feito** para isso:

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

Comparado à versão anterior, algumas coisas se destacam imediatamente:

- ✅ **Não há necessidade de `useState` ou `useEffect`** para gerenciar o estado da página.
- ✅ **Não há rastreamento manual** da página atual ou mesclagem de dados.
- ✅ `useInfiniteQuery` lida com tudo isso internamente e fornece helpers como `fetchNextPage` e `hasNextPage`.

Como `useInfiniteQuery` retorna os resultados em **páginas** (cada página sendo uma resposta da API), precisamos apenas fazer `flatMap` de todos os resultados em um único array para alimentar a `FlatList`.

Esta estrutura torna o componente **mais simples, mais limpo e mais fácil de entender**, especialmente ao trabalhar com APIs paginadas.

![exemplo useInfiniteQuery](/use-infinite-query-example.gif)
![profiler useInfiniteQuery](/use-infinite-query-profiler.png)

## Conclusão

Se você está implementando scroll infinito no React Native, **prefira `useInfiniteQuery` em vez de `useQuery`**. Ele simplifica a lógica, reduz bugs e torna seus componentes mais fáceis de entender.

Embora `useQuery` tecnicamente funcione, rapidamente se torna verboso e propenso a erros. Quando o objetivo é buscar mais dados conforme o usuário faz scroll, `useInfiniteQuery` foi construído para o trabalho.

Escolha a ferramenta certa para o cenário certo e mantenha seu scroll suave. 🚀

Obrigado por ler até o final!
