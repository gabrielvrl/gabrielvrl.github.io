---
title: "Melhorando a performance no React Native com o useDeferredValue"
description: "Melhorando a performance no React Native com o useDeferredValue"
pubDate: "Jun 14 2025"
heroImage: "/react_native.png"
---

## O problema

Um desafio muito comum para desenvolvedores front-end, seja mobile ou web, é lidar com buscas em listagens grandes, em especial de forma dinâmica, sem ter um botão que o usuário clica para realizar a busca. Observe o seguinte código e seu comportamento:

Breve explicação sobre o código: Nele temos um estado `query` que vai controlar a renderização da flatList filtrada. Temos também uma técnica de `busy wait` com laço `while` apenas para ocupar processamento na CPU já que nossa lista de filmes é apenas um array mockado e não de fato uma chamada à API.

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

![Apenas useState](/use-state-with-flat-list.gif)

![Profiler do apenas useState](/profiler-use-state-with-flat-list.png)

Podemos observar que há uma re-renderização “grande” de aproximadamente 1000ms a cada letra que é digitada, porque além do estado `query` estar sendo atualizado, que naturalmente gera uma nova re-renderização, a flat list também é re-renderizada a cada iteração, o que pode ser muito custoso caso o dispositivo do seu usuário não seja tão poderoso.

## Solução 1 - debounce

Uma solução muito comum que desenvolvedores usaram ao longo dos anos e ainda é válida, é criar um `debounce`, técnica que atrasa a execução de uma função por `x` milissegundos.

Mas talvez, no cenário onde não queremos travar a UI mas deixar que o React priorize tarefas mais importantes em background, o debounce pode não ser a melhor solução.

### ⚠️ O problema com debounce fixo

Usar um valor fixo como `300ms` parece seguro, mas:

- ⚡ **Em dispositivos rápidos**, você pode estar **atrasando desnecessariamente** a atualização.
- 🐢 **Em dispositivos lentos**, 300ms **podem não ser suficientes**. A renderização ainda pode travar porque o React já está tentando recalcular enquanto a CPU ainda está lidando com outras tarefas.

Ou seja: **um número fixo não se adapta ao contexto do usuário**.

## Solução 2 - useDeferredValue

O time do React introduziu no [React 18](https://github.com/facebook/react/releases/tag/v18.0.0) o hook chamado `useDeferredValue` , que pela própria definição do React, em tradução livre:

> useDeferredValue permite adiar a renderização de uma parte não urgente da árvore. É semelhante ao debouncing, mas apresenta algumas vantagens. Não há um atraso de tempo fixo, então o React tentará a renderização adiada logo após a primeira renderização ser refletida na tela. A renderização adiada é interrompível e não bloqueia a entrada do usuário.

Dito isso, vamos ver um exemplo apenas usando o `useDeferredValue` no lugar do `query` na filtragem dos filmes:

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

![useState com useDeferredValue](/use-deferred-value-with-flat-list.gif)

![Profiler do useState com useDefferedValue](/profiler-use-deferred-value-with-flat-list.png)

Perceba que já há uma melhora na experiência, a flat list só muda quando o valor do `defferedQuery` muda. Você pode inclusive adicionar um componente de `loading` caso a valor de `query` seja diferente `deferredQuery` indicando um carregamento. Mas… ainda estamos com grandes re-renderizações aproximadamente 1000ms. Como podemos resolver esse problema?

## Solução 3 - useDeferredValue + useMemo

Apesar de estarmos utilizando o useDeferredValue, ele **não** bloqueia efeitos colaterais, nem por si só previne chamadas à API. Dito isso, podemos combinar seu uso com o hook `useMemo`.

Obverse o comportamento, o profiler e o código atualizado abaixo:

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

![useDeferredValue com useMemo](/use-deferred-value-with-use-memo-with-flat-list.gif)

![Profiler do useDeferredValue com useMemo](/profiler-use-deferred-value-with-use-memo-with-flat-list.png)

Perceba que, apesar de termos vários commits no profiler, as renderizações são mínimas e 10ms, em comparação à última de 1000ms onde realmente houve a atualização da listagem. Isso **é uma melhora de** praticamente **99%**!

## Conclusão

Embora `useDeferredValue` seja uma ferramenta poderosa para melhorar a responsividade em interfaces dinâmicas, **não é uma solução universal que resolve todos os problemas de performance**. Ele funciona melhor em **casos específicos**, como:

- Filtragens ou ordenações pesadas baseadas em entrada do usuário;
- Interfaces com listas grandes que sofrem com renderizações repetidas;
- Evitar renderizações imediatas de componentes caros enquanto a digitação acontece.

No entanto, **não é ideal para todo tipo de interação**. Evite usar `useDeferredValue` quando:

- A atualização precisa acontecer imediatamente (ex.: máscaras de formulário, campos sensíveis como CPF, CEP, valores monetários);
- O dado ou ação depende de sincronismo preciso com o input (ex.: validações em tempo real ou interações com feedback instantâneo);
- O custo da renderização é baixo e não há impacto perceptível na experiência.

Em resumo, `useDeferredValue` **deve ser aplicado com critério**, priorizando cenários onde o custo da renderização pode afetar a fluidez da UI. Use-o como uma forma de melhorar a **priorização de tarefas**, e não como substituto para outras boas práticas de performance.

Obrigado por ler até aqui!
