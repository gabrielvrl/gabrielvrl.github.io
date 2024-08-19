---
title: "Why did i choose Astro to build my blog?"
description: "description"
pubDate: "Aug 18 2024"
heroImage: "/astro.png"
---

## <span class="dark:text-white">What is Astro?</span>

Astro is a web framework that aims to <span class="font-bold">be performant</span>. According to your own <a target="_blank" href="https://docs.astro.build/en/concepts/why-astro/" class="dark:text-white dark:hover:text-gray-100"> documentation</a>, Astro was a pioneer in <a target="_blank" href="https://docs.astro.build/en/concepts/islands/" class="dark:text-white dark:hover:text-gray-100">islands architecture</a>, which aims to reduce the clutter and complexity of client-side JavaScript.

Let's go into the technical details of this architecture: <br />
Astro island architecture is a way of working in which the page is built by static parts and interactive parts, which we can understand and call islands. Follow the following figure:

<img src="/astro-islands.png" />

We can simplify and understand that each box in the image is a component, and thus, we have 2 interactive components/islands and 3 static components/islands.

Important considerations about islands:

1. An island runs in isolation from other islands on the page.
2. There can be multiple islands on the same page.
3. Due to Astro's support for <a target="_blank" href="https://docs.astro.build/en/guides/integrations-guide/#official-integrations" class="dark:text-white dark:hover:text-gray-100">multiple frameworks</a>, such as React, Vue, Svelte... It is possible, through the island architecture, to have multiple frameworks on a page. Which can be an advantage if you have more than one developer on the project or you want to learn a new framework without starting a project from scratch or even migrating frameworks without downtime.

<br />

Furthermore, by default Astro automatically renders all UI components statically, i.e. to just HTML and CSS, removing all client-side JavaScript. It may seem like an exaggeration, but it is very common, as developers, to send more JavaScript to the client side than necessary when we are developing.

```jsx
<MyReactComponent />
```

Making a static UI component for an interactive island is very simple and requires just one property, `client:*` . Astro will automatically build and package client-side JavaScript for optimized performance.

```jsx
<!-- This component is now interactive on the page!
     The rest of your website remains static. -->
<MyComponentReact client:load />
```

We can pass `client:load` , `client:only` , `client:idle`, `client:visible` and each property has its peculiarity that you can read in more detail <a target="_blank" href="https://docs.astro .build/en/reference/directives-reference/#client-directives" class="dark:text-white dark:hover:text-gray-100">here</a>.

You may have noticed that this functionality is very familiar with <a target="_blank" href="https://react.dev/reference/rsc/server-components" class="dark:text-white dark:hover:text-gray-100 ">_server components_</a> and the directive <a target="_blank" href="https://react.dev/reference/rsc/use-client" class="dark:text-white dark:hover:text-gray-100" >_'use client'_</a> from React, however, in my opinion, Astro is a simpler and less bloated framework than React, which makes it a better choice for a simple blog like mine. I will talk more about this topic next time <a target="_blank" href="#why-did-i-choose-astro-and-what-were-the-other-options" class="dark:text-white dark:hover:text- gray-100">section</a>.

In my opinion, it is the combination of these two features that makes Astro performant and a great development experience.

In short, about Astro:

1. Server first, taking rendering off users' devices.
2. Zero JS by default.
3. Content Collections: Organizes, validates, and provides TypeScript type safety for your Markdown content.
4. Customizable: Provides several integrations with today's main tools, including <a target="_blank" href="https://docs.astro.build/en/guides/integrations-guide/tailwind/" class="dark:text-white dark:hover:text-gray-100">Tailwind</a> and <a target="_blank" href="https://docs.astro.build/en/guides/typescript/" class="dark:text-white dark:hover:text-gray-100">Typescript</a> very simply. See other integrations <a target="_blank" href="https://docs.astro.build/en/guides/integrations-guide/" class="dark:text-white dark:hover:text-gray-100">here</a>.

## <span class="dark:text-white">Why did I choose Astro and what were the other options?</span>

I was looking for something simple and modern, where I could use <a target="_blank" href="https://react.dev/" class="dark:text-white dark:hover:text-gray-100">React.js </a>, a tool that I have been working on for the last few years. So, my options were:

1. An application only with React.js, but I was afraid that it might lose support and features, since <a target="_blank" href="https://react.dev/learn/start-a-new-react- project" class="dark:text-white dark:hover:text-gray-100">React documentation</a> recommends using frameworks. ❌
2. Use a framework, in this case you would have some options, such as <a target="_blank" href="https://www.gatsbyjs.com/" class="dark:text-white dark:hover:text-gray-100">Gatsby </a> and <a target="_blank" href="https://remix.run/" class="dark:text-white dark:hover:text-gray-100">Remix</a>, but as I've already worked with <a target="_blank" href="https://nextjs.org/" class="dark:text-white dark:hover:text-gray-100">Next.js</a> in the past, it would be the React framework that I would choose. However, the intention of this site is to just be a simple blog where I can share part of my knowledge and express my opinions on technical matters. I understood that choosing Next.js, in its current state, would be like using a bazooka to kill an ant. I can barely keep up with the news that the framework launches every 6 months, wouldn't my blog suffer for that? ❌
3. Finally, I found Astro, which seemed like exactly what I needed. A simple, performant web framework that I could use React.js. ✅

We can create Astro components and pages with the `.astro` extension, which has a syntax very familiar to current frameworks, for example, see the rendering of the pages of each article on my blog:

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

I don't know about you, but for me it's very similar to a React.js page, and even `getStaticPaths` reminds me of Next.js' own getStaticPaths.

It is also possible to create components with the `.tsx` extension and use React, look at this example:

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

And we can use this component within a `.astro` page, like this:

```tsx
---
import { Title } from "../../components/title";
---
  <div class="flex row w-full gap-4 items-center mb-4">
    <Title id="hello">Olá! 👋</Title>
  </div>
```

## <span class="dark:text-white">Conclusion</span>

Astro allows me to work with React.js, Typescript and Tailwind in a very simple, quick and performant way. Until then I'm happy with the development experience. As a result, the blog has great metrics in Lighthouse without me having to work too hard to achieve:

<img src="/lighthouse.png" />

When I started writing this post, I was using an external CMS, but, to follow my philosophy of keeping this blog simple, I am writing in `.md` files, which are already configured by Astro in your blog template for that works without any extra configuration. I hope you enjoyed the content, my intention is to share my experiences, technical knowledge and learn more in the process. Thanks.
