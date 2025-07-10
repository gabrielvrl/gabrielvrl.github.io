---
title: "Botões no React Native: Entendendo a diferença e quando usar cada um"
description: "Explorando as opções nativas de botões disponíveis no React Native"
pubDate: "Jul 10 2025"
heroImage: "/react_native.png"
---

Neste post, vamos explorar as opções nativas de botões disponíveis no React Native, sem bibliotecas externas envolvidas.

Para demonstrar, vou criar um novo projeto React Native usando a versão 0.80 com o seguinte comando:

```bash
npx @react-native-community/cli@latest init buttons
```

Se olharmos a seção [Core Components](https://reactnative.dev/docs/components-and-apis) na documentação oficial, encontraremos **cinco componentes** que se comportam como botões ou respondem a interações de toque:

- Button
- Pressable
- TouchableHighlight
- TouchableOpacity
- TouchableWithoutFeedback

Embora tenham algumas diferenças, todos fornecem um comportamento similar de botão.

---

**TL;DR**

Na maioria dos casos, você deve usar **`Pressable`**.

Ele oferece uma API mais robusta, e a própria documentação do React Native recomenda migrar dos componentes `Touchable*` legados em favor do `Pressable` para apps à prova de futuro.

O componente `Button` funciona bem, mas oferece **customização muito limitada**.

---

## Exemplo de Código

Vamos ver todos os cinco componentes na mesma tela. O código abaixo registra uma mensagem no console para cada um quando pressionado, sem estilização adicionada. Isso nos dá uma visão clara do comportamento padrão no iOS e Android.

```tsx
import {
  StyleSheet,
  SafeAreaView,
  Button,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Button Component"
        onPress={() => {
          console.log("Button Pressed");
        }}
      />
      <Pressable
        onPress={() => {
          console.log("Pressable Pressed");
        }}
      >
        <Text>Pressable with Text component</Text>
      </Pressable>
      <TouchableHighlight
        onPress={() => {
          console.log("TouchableHighlight Pressed");
        }}
      >
        <Text>TouchableHighlight with Text component</Text>
      </TouchableHighlight>
      <TouchableOpacity
        onPress={() => {
          console.log("TouchableOpacity Pressed");
        }}
      >
        <Text>TouchableOpacity with Text component</Text>
      </TouchableOpacity>

      <TouchableWithoutFeedback
        onPress={() => {
          console.log("TouchableWithoutFeedback Pressed");
        }}
      >
        <Text>TouchableWithoutFeedback with Text component</Text>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
});

export default App;
```

---

![exemplo botões gif](/buttons-example.gif)

![exemplo botões](/buttons-example.png)

![botões profiler](/profiler-buttons.png)

---

## Visão Geral dos Componentes

### Button

- ✔️ Simples e fácil de usar
- ❌ Quase nenhuma opção de estilização
- ✅ Bom para testes rápidos ou MVPs

### TouchableOpacity

- Diminui a opacidade quando pressionado, dando feedback visual
- Internamente envolve os filhos em um `Animated.View`, o que pode afetar o layout
- Bom equilíbrio entre simplicidade e flexibilidade

### TouchableHighlight

- Aplica uma cor de fundo quando pressionado
- Requer uma cor de fundo para evitar artefatos visuais indesejados
- Aceita apenas um filho. Envolva com `View` se necessário
- Menos comum em UIs modernas

### TouchableWithoutFeedback

- Nenhum feedback visual
- Não deve ser usado para botões a menos que haja uma razão específica
- Caso de uso comum: dispensar o teclado ao tocar no fundo
- Suporta apenas um filho, e o clona internamente

### Pressable

- Suporta múltiplos estados: pressionado, hover, focado
- Permite estilização dinâmica baseada no estado
- Recomendado pela equipe do React Native como o input de toque padrão
- Melhor opção para componentes de UI customizados
- Exemplo de uso:

```tsx
<Pressable
  onPress={() => {
    console.log("Pressable Pressed");
  }}
  style={({ pressed }) => [
    {
      backgroundColor: pressed ? "lightgray" : "white",
      padding: 10,
      borderRadius: 5,
    },
  ]}
>
  <Text>Pressable with Text component</Text>
</Pressable>
```

## Conclusão

Embora o React Native ofereça múltiplos componentes para lidar com interações de toque, **nem todos são igualmente recomendados hoje**.

A documentação oficial agora **desencoraja o uso dos componentes `Touchable*` mais antigos** (`TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`) em favor do mais moderno e flexível `Pressable`. A equipe do React Native afirma explicitamente que `Pressable` é **a solução preferida e à prova de futuro** para lidar com input de toque.

O componente `Button` integrado, embora fácil de usar, vem com **controle muito limitado de estilização e comportamento**. É útil para protótipos rápidos ou apps básicos, mas fica aquém quando você precisa de customização ou consistência entre plataformas.

### Dicas práticas

- ✅ Use **`Pressable`** para a maioria das interações de toque customizadas. É o padrão atual e oferece muito mais controle.
- ⚠️ `TouchableOpacity` ainda funciona, mas é considerado **legado**.
- ❌ Evite `TouchableHighlight` e `TouchableWithoutFeedback` a menos que tenha uma razão muito específica.
- ⛔ `Button` é adequado para testes rápidos, mas não é adequado para algo que precisa de flexibilidade ou UI customizada.

Se você está iniciando um novo projeto React Native hoje, **`Pressable` deve ser sua escolha padrão** para qualquer coisa que precise responder à interação do usuário.

Obrigado por ler até aqui!
