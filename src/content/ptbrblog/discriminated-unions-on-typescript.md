---
title: "Discriminated Unions no TypeScript"
description: "description"
pubDate: "Sep 14 2024"
heroImage: "/typescript.png"
---

Imagine que temos uma função que calcula a área de uma figura geométrica e precisamos criar uma interface `Shape` para essa função. Por hora vamos focar apenas em duas figuras básicas: um círculo, que chamaremos de `circle` e um quadrado, que chamaremos de `square`.

Sabemos que para calcular a área de um círculo, precisamos do raio e da fórmula `π * radius²`, ou `π * radius * radius`, onde `radius` é o raio. Já para o quadrado, precisamos da largura de um dos lados, em que vamos chamar de `sideLength`, e da fórmula: `sideLength * sideLength`.

Uma das maneiras de criarmos essa tipagem é assim:

```tsx
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

Nessa interface, a propriedade `kind`, define qual a figura geométrica queremos calcular a área, um círculo `circle`, ou um quadrado `square`. Baseado nisso, podemos passar o raio ou a largura de um dos lados. Mas isso não está 100% correto, não é?

O exemplo a seguir não deveria nos retornar um erro?
<img src="/calculate-area-function-no-error-example.png" />

Observe a seguinte função:

```tsx
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // Temos um erro aqui: 'shape.radius' is possibly 'undefined'.ts(18048)
  } else {
    return shape.sideLength ** 2;
    // E outro aqui: 'shape.sideLength' is possibly 'undefined'.ts(18048)
  }
}
```

Por que isso está acontecendo?

É porque ambos `radius` e `sideLength` são parâmetros opcionais na interface! Você pode passar apenas o `kind`, já que é a única propriedade obrigatória. Isso signifca que para a execução da função, você pode omitir o `radius` e o `sideLength`, porque não parâmetros são obrigatórios.

Você também pode tentar não passar o `kind`, mas isso vai resultar em um erro:

`Argument of type '{}' is not assignable to parameter of type 'Shape'. Property 'kind' is missing in type '{}' but required in type 'Shape'.ts(2345)`.

Beleza, Gabriel. Mas como podemos resolver esse problema? Usando <span class="font-bold">Discriminated Unions!</span>

Podemos definir um novo tipo chamado `Circle`, que exige que tanto `kind` quanto `radius` sejam fornecidos. Da mesma forma, podemos definir um tipo chamado `Square`, que também requer o `kind`, mas substitui `radius` por `sideLength`. E aqui está a chave de tudo: especificamente, para o tipo `Circle`, o valor de `kind` deve ser `"circle"`, e para o tipo `Square`, o valor do `kind` deve ser `"square"`.

```tsx
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
```

Ótimo! Agora podemos criar a nossa tipagem `Shape`!

```tsx
type Shape = Circle | Square;
```

E olha só! Não temos nenhum erro na nossa função `calculateArea`!
<img src="/no-errors-calculate-area-function.png" />

E ainda temos um ótimo autocomplete!

<img src="/calculate-area-function-with-auto-complete.png" />
<img src="/calculate-area-function-radius-autocomplete.png" />

Se tentarmos passar uma propriedade de forma incorreta, vamos ter um erro apontado no código:

<img src="/calculate-area-function-radius-error-on-square-type.png" />

`Object literal may only specify known properties, and 'radius' does not exist in type 'Square'.ts(2353)`

Obrigado por ler até aqui! Espero que este artigo tenha te ajudado a entender melhor como <span class="italic">discriminated unions</span> funcionam no TypeScript.

Para referência:

- <span class="font-bold">π (pi)</span>: A constante matemática usada na fórmula da área de um círculo.
- <a target="_blank" href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions" class="dark:text-white dark:hover:text-gray-100">Documentação do TypeScript sobre Discriminated Unions</a>
