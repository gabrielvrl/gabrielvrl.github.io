---
title: "useRef x useState no React Native"
description: ""
pubDate: "Feb 01 2025"
heroImage: "/react_native.png"
---

O React Native permite que os desenvolvedores construam aplicativos móveis usando o React, o que o torna uma ferramenta poderosa para criar aplicativos cross-platform. Assim como no React para a web, o React Native oferece hooks como `useRef` e `useState` para gerenciar estado e referências. No entanto, entender quando e por que usar um em vez do outro pode ser complicado, especialmente quando você está lidando com desempenho e comportamentos específicos de mobile.

Neste artigo, exploraremos as principais diferenças entre `useRef` e `useState` no <strong class="dark:text-white">React Native</strong> e discutiremos suas vantagens e desvantagens para ajudá-lo a fazer o melhor escolha para seus projetos.

Usaremos o <strong class="dark:text-white">Expo</strong> para criar nossa aplicação React Native. Você pode criar o app executando `npx create-expo-app@latest` em seu terminal e nomeando o projeto como `userefxusestate`.

A seguir, removeremos todo o conteúdo da home e nos aprofundaremos em nosso estudo, começando com `useState`.

<h3 class="dark:text-white">O que é o useState?</h3>

`useState` é um hook que permite adicionar estado aos seus componentes funcionais. Quando o estado muda, o componente é renderizado novamente para refletir o estado atualizado. Isso torna o `useState` essencial para lidar com interações do usuário, buscar dados ou qualquer situação em que você precise acionar uma nova renderização com base em mudanças de estado.

Vamos criar um botão que incrementa um contador, começando em 0:

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

No exemplo acima, `count` é uma o estado que aciona uma nova renderização na tela sempre que seu valor muda. Cada vez que você chama `setCount`, o componente é renderizado novamente com o valor atualizado.

Observe que toda vez que clico no botão de incremento, ocorre um novo log de nova renderização.

<img src="/use-state-example.gif" />

Mas isso <strong class="dark:text-white">não acontecerá</strong> quando usarmos `useRef`!

<h3 class="dark:text-white">O que é o useRef?</h3>

`useRef` é um hook que cria um objeto mutável que persiste durante a vida útil do componente. O valor armazenado em uma referência não aciona uma nova renderização quando alterado. Isso o torna ideal para armazenar valores que não devem causar uma nova renderização, como referências DOM, timers ou quaisquer dados mutáveis ​​que não afetem a IU.

Vejamos o mesmo exemplo usando `useRef` e observe o comportamento:

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

Nesta versão, adicionei um log na função `handleOnPress` para exibir a contagem atual.

Observe como a tela não muda! Mesmo que a ref esteja sendo atualizada, ela <strong class="dark:text-white">não causa uma nova renderização</strong>, porque `useRef` não aciona uma quando o valor de `count.current` mudar.

<img src="/use-ref-example.gif" />

Agora, vejamos um exemplo onde usar `useRef` faz mais sentido.

<h3 class="dark:text-white">Usando useRef para lógica de um temporizador</h3>

Considere o exemplo a seguir, onde usamos `useRef` para gerenciar um cronômetro:

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

Neste exemplo, `timerRef` armazena uma referência ao intervalo do temporizador. Alterar `timerRef.current` não aciona uma nova renderização, que é exatamente o que queremos para lógicas não relacionadas à UI, como temporizadores, cronômetros ou integrações externas.

<img src="/use-ref-example-2.gif" />

Agora, vamos ver o comportamento usando `useState`.

<h3 class="dark:text-white">Usando useState para lógica de um temporizador</h3>

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

Aqui, usando `useState`, temos duas re-renderizações desnecessárias: uma para definir o intervalo e outra para limpá-lo. No total, são duas re-renderizações a mais, em comparação com o uso de `useRef`. Se olharmos de outra perspectiva, são três vezes mais re-renderizações, considerando que a primeira re-renderização sempre acontece quando a tela é montada.

---

<h3 class="dark:text-white">Principais diferenças entre useState e useRef</h3>

| <span class="dark:text-white">Aspecto</span>                        | `useState`                                                      | `useRef`                                                                         |
| ------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <strong class="dark:text-white">Propósito</strong>                  | Armazena o estado que aciona novas renderizações.               | Armazena valores mutáveis ​​que não acionam novas renderizações.                 |
| <strong class="dark:text-white">Aciona a nova renderização</strong> | Sim, qualquer alteração no estado aciona uma nova renderização. | Não, alterar `ref.current` não aciona novas renderizações.                       |
| <strong class="dark:text-white">Caso de uso</strong>                | Para estado relacionado à UI que afeta a renderização.          | Para valores ou referências (como elementos DOM) que não afetam a renderização.  |
| <strong class="dark:text-white">Exemplo de uso</strong>             | Inputs de formulários, contadores, toggles, etc.                | Referências de temporizador, bibliotecas externas, referências de elementos DOM. |

---

<h3 class="dark:text-white">Quando usar o useState</h3>

Use `useState` quando precisar rastrear e atualizar valores que afetam a exibição do seu componente. Pode ser qualquer coisa, desde inputs de formulário até contadores ou dados obtidos de uma API.

<h3 class="dark:text-white">Quando usar o useRef</h3>

Por outro lado, use `useRef` quando precisar armazenar uma referência a um elemento DOM (no React Native, pode ser uma View, por exemplo) ou um valor que persista nas renderizações sem causar novas renderizações. É ideal para cenários como gerenciamento de timers, armazenamento de valores de estado anteriores ou acesso a objetos mutáveis ​​(como bibliotecas de terceiros).

<h3 class="dark:text-white">Conclusão</h3>

Tanto `useRef` quanto `useState` são hooks poderosos para gerenciar estado e referências em aplicativos React Native. A principal conclusão é que `useState` é melhor para valores que precisam acionar novas renderizações quando atualizados, enquanto `useRef` deve ser usado para valores que persistem sem causar renderizações desnecessárias.

Ao entender as diferenças entre esses dois hooks, você irá escrever aplicações React Native de forma mais eficiente e de alto desempenho!
