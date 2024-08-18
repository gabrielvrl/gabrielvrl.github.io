---
title: "Por que escolhi o Astro para construir meu blog?"
description: "descrição"
pubDate: "Aug 18 2024"
heroImage: "/astro.png"
---

## <span class="dark:text-white">O que é Astro?</span>

O Astro é um framework web que visa <span class="font-bold">ser performático</span>. De acordo com sua própria <a href="https://docs.astro.build/pt-br/concepts/why-astro/" class="dark:text-white dark:hover:text-gray-100">documentação</a>, foi pioneiro na <a href="https://docs.astro.build/pt-br/concepts/islands/" class="dark:text-white dark:hover:text-gray-100">arquitetura em ilhas</a>, que visa reduzir o excesso e a complexidade do JavaScript no lado do cliente.

Vamos entrar no detalhe técnico dessa arquitetura: <br />
A arquitetura em Ilhas do Astro é uma forma de trabalhar em que a página é construída por partes estáticas e por parte interativas, que podemos entender e chamar de ilhas. Acompanhe na seguinte figura:

<img src="/astro-islands.png" />

Podemos fazer uma simplificação e entender que cada caixinha na imagem é um componente, e assim, temos 2 componentes/ilhas interativas e 3 componentes/ilhas estáticas.

Considerações importantes sobre ilhas:

1. Uma ilha executa de forma isolada de outras ilhas na página.
2. Podem existir múltiplas ilhas em uma mesma página.
3. Devido ao suporte do Astro à múltiplos frameworks, como React, Vue, Svelte… É possível, pela arquitetura de ilhas, ter múltiplos frameworks em uma página. Que pode ser uma vantagem caso tenha mais de um desenvolvedor no projeto ou você queira aprender um novo framework sem começar um projeto do zero ou até migrar de framework sem um período de inatividade.

<br />

Além disso, por padrão o Astro renderiza automaticamente todos os componentes de UI de forma estática, ou seja, para apenas HTML e CSS, removendo todo o JavaScript do lado do cliente. Pode parecer exagero, mas é muito comum, como desenvolvedores, mandarmos mais JavaScript para o lado do cliente do que necessário quando estamos desenvolvendo.

```jsx
<MeuComponenteReact />
```

Para tornar um componente de UI estático para uma ilha interativa é bem simples e requer apenas uma propriedade, o `client:*` . O Astro vai fazer um build automaticamente e empacotar o JavaScript do lado do cliente para uma performance otimizada.

```jsx
<!-- Este componente agora é interativo na página!
     O resto do seu website continua estático. -->
<MeuComponenteReact client:load />
```

Podemos passar `client:load` , `client:only` , `client:idle`, `client:visible` e cada propriedade tem sua peculiaridade que você pode ler em mais detalhes <a href="https://docs.astro.build/en/reference/directives-reference/#client-directives" class="dark:text-white dark:hover:text-gray-100">aqui</a>.

Você pode ter percebido que essa funcionalidade é muito familiar com o <a href="https://react.dev/reference/rsc/server-components" class="dark:text-white dark:hover:text-gray-100">_server compponents_</a> e a diretriz <a href="https://react.dev/reference/rsc/use-client" class="dark:text-white dark:hover:text-gray-100">_'use client'_</a> do React, porém, na minha opinião, o Astro é um framework mais simples e menos inchado que o React, o que o faz uma melhor escolha para um blog simples como o meu. Irei tratar mais sobre esse tema na próxima <a href="#por-que-escolhi-o-astro-e-quais-eram-as-outras-opções" class="dark:text-white dark:hover:text-gray-100">seção</a>.

Na minha opinião, é a combinação dessas duas funcionalidades que faz com o Astro seja performático e tenha uma ótima experiência de desenvolvimento.

Em suma, sobre o Astro:

1. Servidor em primeiro lugar, tirando a renderização dos dispositivos dos usuários.
2. Zero JS, por padrão.
3. Coleções de conteúdo: Organiza, valida e ofereçe segurança de tipos do TypeScript para seus conteúdos Markdown.
4. Customizável: Fornece diversas integrações com as principais ferramentas da atualidade, incluindo <a href="https://docs.astro.build/pt-br/guides/integrations-guide/tailwind/" class="dark:text-white dark:hover:text-gray-100">Tailwind</a> e <a href="https://docs.astro.build/en/guides/typescript/" class="dark:text-white dark:hover:text-gray-100">Typescript</a> de forma muito simples. Veja outras integrações <a href="https://docs.astro.build/pt-br/guides/integrations-guide/" class="dark:text-white dark:hover:text-gray-100">aqui</a>.

## <span class="dark:text-white">Por que escolhi o Astro e quais eram as outras opções?</span>

<a href="https://react.dev/" class="dark:text-white dark:hover:text-gray-100">React.js</a>
<a href="https://nextjs.org/" class="dark:text-white dark:hover:text-gray-100">Next.js</a>
<a href="https://remix.run/" class="dark:text-white dark:hover:text-gray-100">Remix</a>
<a href="https://www.gatsbyjs.com/" class="dark:text-white dark:hover:text-gray-100">Gatsby</a>
<a href="https://react.dev/learn/start-a-new-react-project" class="dark:text-white dark:hover:text-gray-100">documentação</a>

Eu estava buscando algo simples e moderno, em que eu pudesse utilizar o React.js, ferramenta que venho trabalhando nos últimos anos. Então, minha opções eram:

1. Uma aplicação apenas com React.js, porém fiquei com receio de que pudesse perder em suporte e funcionalidades, já que a própria documentação do React recomenda o uso de frameworks. ❌
2. Utilizar um framework, nesse caso teriam algumas opções, como o Gatsby e o Remix, mas como eu já trabalhei com o Next.js no passado, seria ele o framework React que eu iria escolher. Porém, o intuito desse site é ser apenas um blog simples em que eu possa compartilhar parte do meu conhecimento e expressar minhas opiniões sobre assuntos técnicos. Eu entendi que a escolha do Next.js, no estado atual, seria como utilizar uma bazuca para matar uma formiga. Mal consigo acompanhar as novidades que o framework lança a cada 6 meses, será que meu blog não sofreria por isso? ❌
3. Por fim, encontrei o Astro, que parecia ser exatamente o que eu precisava. Um framework web simples, performático e que eu poderia utilizar o React.js. ✅

Podemos criar componentes e páginas Astro com a extensão `.astro`, que tem uma sintaxe muito familiar aos dos frameworks atuais, por exemplo, veja a renderização das páginas de cada artigo do meu blog:

```jsx
---
import { getCollection, type CollectionEntry } from "astro:content";
import BlogPost from "../../../layouts/BlogPost.astro";

export async function getStaticPaths() {
  const posts = await getCollection("ptbrblog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
type Props = CollectionEntry<"ptbrblog">;

const post = Astro.props;
const { Content } = await post.render();
---

<BlogPost {...post.data}>
  <Content />
</BlogPost>

```

Não sei para vocês, mas pra mim é muito parecido com uma página React.js, e até o `getStaticPaths` lembra o próprio getStaticPaths do Next.js.

Também é possível criar componentes com a extensão `.tsx` e utilizar o React, observe esse exemplo:

```tsx
import React from "react";

interface TitleProps {
  id?: string;
  children: React.ReactNode;
}

export const Title = ({ id, children }: TitleProps) => {
  return (
    <h1 id={id} className="text-4xl leading-tight dark:text-white">
      {children}
    </h1>
  );
};
```

E podemos utilizar esse componente dentro de uma página `.astro`, assim:

```jsx
---
import { Title } from "../../components/title";
---
  <div class="flex row w-full gap-4 items-center mb-4">
    <Title id="hello">Olá! 👋</Title>
  </div>
```

## <span class="dark:text-white">Conclusão</span>

O Astro me permite trabalhar com React.js, Typescript e Tailwind de uma maneira muito simples, rápida configuração e performática. Até então estou feliz com a experiência de desenvolvimento. Como resultado, o blog tem ótimas métricas no Lighthouse sem que eu precise me esforçar muito para conseguir:

<img src="/lighthouse.png" />

Quando comecei a escrever esse post, estava utilizando um CMS externo, mas, até para seguir com minha filosofia de manter a simplicidade para este blog, estou escrevendo em arquivos `.md`. Espero que você tenha gostado do conteúdo, minha intenção é compartilhar minhas experiências, conhecimentos técnicos e aprender mais no processo. Obrigado.
