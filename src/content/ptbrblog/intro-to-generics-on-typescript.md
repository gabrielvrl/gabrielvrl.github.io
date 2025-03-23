---
title: "Introdução aos Generics no TypeScript"
description: "Aprenda a aproveitar as vantagens dos Generics no TypeScript para maior flexibilidade e segurança de tipos"
pubDate: "Mar 23 2025"
heroImage: "/typescript.png"
---

Imagine que você está trabalhando em um aplicativo utilizando o React Native e precisa criar uma função que lida com a entrada do usuário e a processa de maneiras diferentes, dependendo do tipo de dado fornecido. Esse é um cenário perfeito para usar _Generics_ no TypeScript.

Com os _Generics_, você pode escrever funções, classes e interfaces que funcionam com qualquer tipo de dado, mantendo a segurança e o poder da verificação estática de tipos do TypeScript. Em vez de duplicar o código para diferentes tipos, os _Generics_ permitem criar funções reutilizáveis e flexíveis.

Vamos explorar como os _Generics_ funcionam no TypeScript com um exemplo simples.

### O Problema: Uma Função para Exibir Informações do Usuário

Suponha que queremos criar uma função que exibe informações de um usuário, mas a estrutura dos dados do usuário pode variar. Por exemplo, podemos ter usuários que fornecem apenas o nome e a idade, ou outros que também podem incluir seu endereço de e-mail.

Primeiro, vamos definir uma interface para o usuário:

```tsx
interface User {
  name: string;
  age: number;
}

interface UserWithEmail extends User {
  email: string;
}
```

Até aqui tudo bem, mas se quisermos criar uma função que funcione tanto para User quanto para UserWithEmail, normalmente teríamos que escrever funções separadas para cada caso. Mas podemos fazer isso usando Generics.

### Usando Generics para Lidar com Diferentes Tipos

Vamos definir uma função genérica que possa lidar com diferentes tipos de dados de usuário. Veja como podemos fazer isso:

```tsx
function displayUserInfo<T extends User>(user: T): void {
  console.log(`Name: ${user.name}`);
  console.log(`Age: ${user.age}`);
  if ("email" in user) {
    console.log(`Email: ${(user as UserWithEmail).email}`);
  }
}
```

Nessa função, `T` é um espaço reservado para o tipo do objeto `user`. Quando chamamos a função, o TypeScript irá inferir automaticamente o tipo com base no argumento passado.

### Como isso funciona?

Quando chamamos a função `displayUserInfo`, o TypeScript automaticamente checa o tipo do usuário e garante que só tentemos acessar as propriedades que existem nesse tipo.

Por exemplo:

```tsx
const user1: User = { name: "Alice", age: 30 };
const user2: UserWithEmail = { name: "Bob", age: 25, email: "bob@example.com" };

displayUserInfo(user1); // Funciona!
displayUserInfo(user2); // Também funciona!
```

### Lidando com Segurança de Tipos

O poder dos Generics entra em cena aqui: em vez de escrever funções separadas para cada tipo (User e UserWithEmail), podemos usar uma única função flexível. Mas ainda assim temos segurança de tipos, se uma propriedade como email não estiver disponível no usuário, o TypeScript nos dará um erro quando tentarmos acessá-la, como mostrado abaixo:

```tsx
const invalidUser = { name: "Charlie", age: 40 };
displayUserInfo(invalidUser); // Error: Property 'name' is missing in type '{}' but required in type 'User'.ts(2345)
```

Esse é um dos principais benefícios de usar Generics, você obtém flexibilidade para lidar com vários tipos, mantendo a forte segurança de tipos em toda a sua aplicação.

### Exemplo Mais Complexo: Classe Genérica para Armazenar Dados

Vamos dar um passo adiante e criar uma classe genérica que armazena itens. Isso pode ser útil em diversos cenários, como gerenciar listas de usuários, produtos ou qualquer outro tipo de dado.

```tsx
class DataStore<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  getItems(): T[] {
    return this.items;
  }
}
```

Agora, podemos criar instâncias de `DataStore` para diferentes tipos:

```tsx
const userStore = new DataStore<User>();
userStore.addItem({ name: "Alice", age: 30 });
console.log(userStore.getItems()); // [ { name: 'Alice', age: 30 } ]

const emailStore = new DataStore<UserWithEmail>();
emailStore.addItem({ name: "Bob", age: 25, email: "bob@example.com" });
console.log(emailStore.getItems()); // [ { name: 'Bob', age: 25, email: 'bob@example.com' } ]
```

Com a classe `DataStore<T>`, você pode gerenciar uma lista de itens de qualquer tipo sem duplicar o código para cada tipo. O `T` na classe age como um espaço reservado para qualquer tipo, que é definido quando você cria uma instância da classe.

### Restrições em _Generics_

Às vezes, você pode querer restringir os tipos que podem ser usados com um Generic. Por exemplo, você pode querer garantir que os dados passados para a função ou classe genérica possuam certas propriedades.

Por exemplo, vamos criar uma função que garante que o objeto passado tenha uma propriedade `name`:

```tsx
function greetUser<T extends { name: string }>(user: T): void {
  console.log(`Hello, ${user.name}!`);
}
```

Neste caso, o tipo `T` está restrito a tipos que possuem a propriedade `name`. Se você tentar passar um objeto sem `name`, o TypeScript mostrará um erro:

```tsx
const userWithName = { name: "Alice", age: 30 };
greetUser(userWithName); // Funciona!

const userWithoutName = { age: 40 };
greetUser(userWithoutName); // Error: Argument of type '{ age: number; }' is not assignable to parameter of type '{ name: string; }'.
```

### Componente Genérico no React Native: Renderizando uma Lista com FlatList

Uma das melhores maneiras de utilizar Generics no React Native é criar um componente que pode renderizar uma lista de qualquer tipo usando o FlatList. Isso é especialmente útil quando você tem uma lista de itens que pode variar de tipo (por exemplo, uma lista de usuários, produtos ou mensagens).

Aqui está um exemplo de um componente reutilizável `ListDisplay` que funciona com qualquer tipo de dado:

```tsx
import React from "react";
import { FlatList, Text, View } from "react-native";

// Defina um tipo genérico para o componente ListDisplay
type ListDisplayProps<T> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
};

const ListDisplay = <T extends { id: string }>({
  data,
  renderItem,
}: ListDisplayProps<T>) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <View>{renderItem(item)}</View>}
    />
  );
};

export default ListDisplay;
```

### How to Use the ListDisplay Component

Agora, digamos que você queira exibir uma lista de usuários. Você pode criar uma lista de objetos `User` e passá-la para o componente `ListDisplay`, fornecendo uma função `renderItem` para definir como cada usuário deve ser exibido:

```tsx
const users = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 40 },
];

const renderUser = (user: User) => (
  <Text>{`${user.name}, Age: ${user.age}`}</Text>
);

// Usando o componente genérico ListDisplay com dados de Usuário
<ListDisplay data={users} renderItem={renderUser} />
You can also use ListDisplay to render a list of products or any other type by simply passing the appropriate data and renderItem function.
```

Exemplo com Produtos:

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Smartphone", price: 800 },
  { id: "3", name: "Headphones", price: 150 },
];

const renderProduct = (product: Product) => (
  <Text>{`${product.name} - $${product.price}`}</Text>
);

// Usando o componente genérico ListDisplay com dados de Produto
<ListDisplay data={products} renderItem={renderProduct} />;
```

### Conclusão

Os _Generics_ no TypeScript permitem que você escreva código flexível, reutilizável e seguro em termos de tipos. Usando Generics, você pode criar funções, classes e até componentes como o `ListDisplay`, que funcionam com qualquer tipo, mantendo a forte segurança de tipos em toda a sua aplicação. Seja construindo um aplicativo com React Native ou trabalhando com a lógica no backend, entender como usar Generics pode ajudá-lo a escrever código mais limpo e de fácil manutenção pode ser muito útil.

Obrigado por ler! Espero que este artigo tenha ajudado você a entender como usar Generics no TypeScript!

Para referência: [Documentação de Generics do TypeScript](https://www.typescriptlang.org/docs/handbook/2/generics.html)
