---
title: "Type vs Interface no TypeScript: Quando e Por que Usar Cada Um"
description: "Entenda as reais diferenças entre type e interface do TypeScript, quando usar cada um, como afetam o desempenho, e por que interfaces são preferíveis para contratos e extensões."
pubDate: "Oct 21 2025"
heroImage: "/typescript.png"
---

## 🧩 Type vs Interface no TypeScript

No TypeScript, temos duas maneiras de declarar tipos: usando a palavra-chave `type` ou a palavra-chave `interface`.

Elas basicamente fazem a mesma coisa, mas há algumas diferenças importantes entre elas, e vamos cobrir isso neste artigo.

---

## ⚡ TL;DR

- Tanto `type` quanto `interface` podem definir formatos de objetos.
- `type` também pode descrever primitivos, uniões e interseções.
- `interface` suporta **declaração de mesclagem (declaration merging)** e **extensão de múltiplas interfaces**.
- Para combinações de tipos, **prefira `interface extends` em vez de `type &`**, pois é mais rápido e previsível.
- Pessoalmente, eu prefiro usar `type` por padrão a menos que eu precise especificamente de algo que só `interface` fornece.

---

### 🧠 **O Básico**

**Interfaces** são usadas apenas para descrever **objetos**, enquanto **types** podem descrever não só objetos, mas também **valores primitivos** como `string`, `number`, `boolean` e mais.

Por exemplo, você pode fazer isto com um type:

```tsx
type Address = string;

const address: Address = "123 Main Street";
```

Mas você **não pode** fazer o mesmo com uma interface! Interfaces só podem descrever **formas de objetos**.

## 🔀 Declaração de Mesclagem (Declaration Merging)

Uma das características mais importantes que diferencia `interface` de `type` é chamada **Declaration Merging** (mesclagem de declarações).

Isso significa que se declararmos múltiplas interfaces com o mesmo nome, o TypeScript automaticamente **as mescla**.

Se tentarmos o mesmo com tipos, teremos um **erro**.

```tsx
// ❌ Type alias throws an error
type User = {
  id: string;
};

type User = {
  name: string; // Error: Duplicate identifier 'User'
};
```

![Type Alias duplicate identifier](/type-duplicate-identifier.png)

```tsx
// ✅ Interfaces are merged automatically
interface User {
  id: string;
}

interface User {
  name: string;
}

const user: User = {
  id: "1",
  name: "John Doe",
};
```

![Interface declaration merging result](/interface-declaration-merging-type-result.png)

Observe como a versão com interface mescla ambas as declarações.

Ela até nos dá um erro de tipo se tentarmos criar um objeto `User` sem `id` ou `name`, porque ambas as propriedades agora existem no tipo final mesclado.

![Interface declaration merging error example](/interface-declaration-merging.png)

> 💡 Dica: É comum entre desenvolvedores TypeScript usar prefixos ou sufixos ao nomear types e interfaces, como `IUser`, `TUser` ou `UserType`.

## ⚙️ Considerações de Desempenho

Quando se trata de **desempenho**, no TypeScript moderno (especialmente após a [reescrita do compilador em Go](https://devblogs.microsoft.com/typescript/typescript-native-port/)), não há **muita diferença** entre usar `type` ou `interface` para a maioria dos casos.

No entanto, há um cenário específico onde **interfaces podem ter melhor desempenho**: ao lidar com **extensões de tipos**.

Segundo o guia oficial de [desempenho do TypeScript](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections), interfaces são **cacheadas internamente**, enquanto **interseções de tipos** (`&`) são **recalculadas a cada uso**.

Em outras palavras:

```tsx
// 👎 Recomputed every time
type Foo = Bar & Baz & { someProp: string };

// 👍 Cached and more efficient
interface Foo extends Bar, Baz {
  someProp: string;
}
```

Portanto, quando você estiver compondo múltiplos tipos, **prefira usar `interface` com `extends`** em vez de `type` com `&`.

## 🧩 A Recomendação Oficial

A [documentação do TypeScript](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) sugere **usar interfaces por padrão** quando possível.

No entanto, minha preferência pessoal é **usar `type` por padrão**, a menos que eu precise especificamente de uma funcionalidade que somente interfaces oferecem.

Embora a **declaração de mesclagem** possa ser poderosa, ela também pode levar a **problemas inesperados** em grandes bases de código com muitos desenvolvedores, especialmente quando pessoas estendem a mesma interface de diferentes partes do código sem saber.

## 🧭 Conclusão

Tanto `type` quanto `interface` são ferramentas poderosas no TypeScript, e muitas vezes se sobrepõem.

Mas entender as pequenas diferenças ajuda a tomar decisões de design melhores no seu código.

✅ Use **`interface`** quando:

- Você quer **estender** ou **mesclar** estruturas.
- Você está definindo **contratos ou APIs públicas**.

✅ Use **`type`** quando:

- Você precisa de **uniões**, **primitivos**, ou **combinações de tipos complexas**.
- Você quer uma sintaxe mais simples e flexível.

No fim das contas, consistência importa mais do que regras rígidas, então escolha uma abordagem que se encaixe no estilo do seu time e mantenha-a.
