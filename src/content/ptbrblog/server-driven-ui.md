---
title: "Desenvolvimento Mobile – Uma Abordagem Diferente para a Entrega de Interface"
description: "Interface Controlada pelo Servidor no desenvolvimento mobile"
pubDate: "Jun 02 2025"
heroImage: "/server-driven-ui.png"
---

Iniciei minha carreira no desenvolvimento web, onde atuei por cerca de um ano e meio a dois anos antes de migrar para o desenvolvimento `mobile`, mantendo muitas das práticas que trouxe da web. No entanto, ao longo do tempo percebi que algumas abordagens tradicionais do desenvolvimento web nem sempre se adaptam perfeitamente ao contexto mobile. Mesmo com alguns anos de experiência, isso me levou a refletir: como construir e manter aplicativos móveis da melhor forma possível? Pela minha experiência, tradicionalmente as construções de aplicativos móveis seguem o mesmo padrão de construção de uma aplicação web, o backend fornece os dados, e o frontend, seja web ou mobile, monta a interface, define os textos, organiza os componentes e implementa os comportamentos.

Mas no desenvolvimento mobile existe uma diferença importante: todos os apps precisam passar pelas lojas de aplicativos, principalmente Google Play (Android) e App Store (iOS), algo que não existe na web. Isso torna o deploy de novas versões mais custoso e lento, já que além de aguardar a aprovação da loja, que pode levar dias, é preciso fazer uma liberação gradual da nova versão, começando com uma pequena porcentagem de usuários, monitorando erros e crashes, e só então expandindo para toda a base. Além disso, o usuário precisa atualizar o app na loja para ter acesso às mudanças, o que pode atrasar ainda mais a adoção. Por isso, mesmo uma simples atualização pode levar dias ou até semanas para chegar ao usuário final. Embora seja possível acelerar o processo forçando a atualização obrigatória, essa estratégia geralmente prejudica a experiência do cliente.

Então, ao enfrentar determinados desafios ao longo da minha carreira, acabei pensando em como posso facilitar o meu trabalho, o do meu time e também entregar, de forma rápida, a melhor experiência para nossos usuários e clientes.

## Problemática e o Firebase

Gostaria de uma solução que contornasse o problema do deploy de uma nova versão no mobile passar por tantos estágios antes de chegar nas mãos dos usuários, especialmente em alterações simples, como de copy, ligar e desligar funcionalidades, alterar comportamentos de fluxo…

Uma das ferramentas mais conhecidas para ajudar a mitigar esse problema de deploy lento no mobile é o **Firebase** (e seus concorrentes, como o _Supabase_). Eles funcionam como um backend-as-a-service e oferecem funcionalidades robustas, como as **Remote Configs**. Com elas, é possível alterar textos, ativar ou desativar funcionalidades, mudar fluxos e até enviar objetos complexos para o app, tudo isso sem precisar publicar uma nova versão na loja. Além disso, essas plataformas também facilitam testes A/B, monitoramento de comportamento dos usuários, autenticação e muito mais.

Nesse artigo eu vou focar na construção da interface, então, por hora, vamos deixar essas outras funcionalidades de lado.

Mas, se por exemplo, quisermos bloquear certa funcionalidade para determinados usuários da nossa base? Não sou especialista em Firebase, mas até onde sei e estudei, é possível sim fazer isso com ele, inclusive podemos fazer de várias formas como criar uma lista com os `ids` dos usuários que devem ser bloqueados ou permitidos e validar na hora de exibir o componente. Tudo bem, isso funciona. Mas repare que estamos adicionando uma complexidade, que pode parecer pequena, em _runtime_ (momento que o app já está rodando no dispositivo do usuário), que nem sempre será moderno ou potente.

Agora imagine se essa lógica de exibição fosse aplicada em várias funcionalidades do app. Isso começa a pesar. E pior: imagine que a decisão de exibir ou não determinada feature dependa de vários dados salvos no banco, como o número de strikes que um cliente já levou, a quantidade de créditos disponíveis, o perfil de uso, e por aí vai. Até dá pra resolver isso com queries no backend e listas dinâmicas, claro. Mas talvez uma melhor alternativa seja já processar essa lógica no backend e enviar pro app só o que ele precisa saber para renderizar.

É justamente nesse ponto que entra o tema que venho estudando e aplicando nos últimos tempos: o **Server-Driven UI**, ou, em tradução livre, Interface Controlada pelo Servidor.

## Server-Driven UI

Diferente da estrutura tradicional, onde o servidor apenas fornece os dados para a construção da UI, mas a responsabilidade é do frontend, o **Server-Driven UI** é um padrão de arquitetura onde o **servidor é responsável por definir parte (ou toda) a estrutura da interface do app**, e o cliente (no nosso caso mobile, mas também pode ser a web) apenas interpreta e renderiza essa UI com base em dados recebidos, geralmente em formato JSON. Ou seja, ao invés de escrever a interface 100% no app, delegamos ao servidor o controle de **o que mostrar, como mostrar e até quando mostrar**. O app atua como um "renderizador”.

Exemplo de payload:

```json
{
  "type": "screen",
  "title": "Promoções",
  "components": [
    {
      "type": "text",
      "value": "Bem-vindo, João!"
    },
    {
      "type": "button",
      "label": "Ver ofertas",
      "action": {
        "type": "navigate",
        "to": "/promocoes"
      }
    }
  ]
}
```

O app então interpreta esse JSON e **renderiza os componentes correspondentes**, como se fosse um mini motor de layout interno.

✅ Nesse modelo, temos algumas vantagens claras, como por exemplo:

- **Deploys instantâneos e mais rápidos**: muda a UI sem subir nova versão do app.
- **Feature flags e testes A/B mais poderosos**.
- **Experimentos rápidos de UI**.
- Permite **customização de interface por usuário ou grupo**.
- Útil para empresas com múltiplos apps/versões mantendo um core comum.

❌ Mas também trás desvantagens:

- **Aumento da complexidade** no cliente: precisa de um interpretador robusto.
- UI menos fluida/reativa se mal implementada.
- Debug mais difícil, já que o conteúdo vem dinâmico.
- Potencial de regressão se o JSON do backend tiver erro.
- Testes de UI convencionais ficam mais complicados.

O Server-Driven UI é uma técnica que pode fazer muito sentido se seu produto, app ou empresa está passando por um momento dinâmico e que precisa ter essa flexibilidade. Situações como lançamentos frequentes de campanhas, experimentos de layout, personalizações por segmento de usuário ou até mesmo mudanças rápidas de copy podem se beneficiar bastante desse modelo.

Mas é importante dizer: **essa abordagem não é mágica,** e definitivamente **não é para tudo**. Se a maior parte do seu app tem uma interface estável, com poucas variações entre usuários, ou se os fluxos são bem definidos e pouco sujeitos a mudanças, talvez o custo de adotar SDUI não compense. Afinal, ao implementar esse modelo, você acaba abrindo mão de parte da previsibilidade e controle direto que tem ao codar as telas da maneira tradicional.

Além disso, construir um bom interpretador de UI no cliente **exige uma arquitetura bem pensada**: tratamento de erros de payload, fallback de componentes, suporte a versionamento, carregamento incremental, performance… Não dá pra simplesmente sair montando UI via JSON e esperar que tudo “funcione”.

Por isso, o SDUI costuma ser aplicado em **zonas do app que são mais instáveis ou orientadas por negócio**, como telas de marketing, campanhas, onboarding, banners, formulários dinâmicos, entre outros. Para telas críticas ou com muita interação nativa, pode ser melhor manter o modelo tradicional, ou até combinar os dois mundos.

## Considerações finais

Server-Driven UI não é uma bala de prata, mas pode ser uma excelente ferramenta quando usada com propósito. Se seu time precisa de mais agilidade para testar, personalizar ou adaptar fluxos de interface com frequência, especialmente sem passar por todo o ciclo de publicação de apps, vale muito a pena explorar esse modelo.

No meu caso, estudar e aplicar essa abordagem tem mudado bastante a forma como penso a construção de apps móveis, especialmente em contextos mais dinâmicos. Se você também enfrenta desafios semelhantes, vale a pena explorar o Server-Driven UI para descobrir se ele pode transformar a maneira como seu time constrói aplicativos.

Obrigado por ler até aqui!
