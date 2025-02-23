---
title: "NVM x FNM: Comparando gerenciadores de versão Node.js."
description: ""
pubDate: "Feb 23 2025"
heroImage: "/nodejs.png"
---

Há alguns dias, encontrei uma postagem no meu feed do LinkedIn falando sobre <a target="blank" href="https://github.com/Schniz/fnm" class="dark:hover:text-gray-700">`fnm`</a>, uma ferramenta desenvolvida com <a target="blank" href="https://www.rust-lang.org/" class="dark:hover:text-gray-700">`Rust`</a> para gerenciamento de versão de Node.js que prometia desempenho mais rápido do que <a target="blank" href="https://github.com/nvm-sh/nvm" class="dark:hover:text-gray-700">`nvm`</a>, a ferramenta que uso há anos.

Infelizmente, não consegui encontrar a URL original da postagem para linkar aqui, mas vou resumir seus pontos e compartilhar minhas ideias depois de usar o fnm por alguns dias em vez do nvm.

Normalmente não caio no _hype_ em torno das novas tecnologias, mas esta foi a primeira vez que realmente vi o poder do Rust. A postagem mencionava algo como “seu terminal pode estar lento por causa do NVM” e isso me fez pensar. Durante a maior parte da minha carreira, não tive um computador super poderoso, mas recentemente comprei um MacBook Pro M1 Max com 32 GB de RAM – uma super máquina! Apesar das especificações, ainda percebi que meu terminal demorava para carregar na primeira vez, embora após o carregamento inicial funcionasse rápido.

Com isso em mente, decidi dar uma chance ao fnm.

<h2 class="dark:text-white">Desinstalando o NVM</h2>

Primeiramente, tive que desinstalar o nvm. Sinceramente, foi um pouco complicado, mas o seguinte comando resolveu o problema:

```bash
rm -rf $NVM_DIR ~/.npm ~/.bower
```

Então removi qualquer menção ao nvm em meu arquivo .zshrc e executei:

```bash
source ~/.zshrc
```

Isso garantiu que o nvm fosse completamente removido da minha máquina e que o terminal pudesse carregar a nova configuração.

<h2 class="dark:text-white">Instalando o FNM</h2>

Instalar o fnm foi muito simples. Basta executar o seguinte comando em seu terminal:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

<h2 class="dark:text-white">Configurando o Shell</h2>

Após a instalação, tive que terminar a configuração do meu shell. Como uso Oh My Zsh, adicionei esta linha:

```bash
eval "$(fnm env --use-on-cd --shell zsh)"
```

Agora que o fnm está configurado, tudo estava pronto para instalar a versão do Node.js que queria e começar a usá-lo:

```bash
fnm install --lts
```

Pela minha experiência, os comandos do fnm são muito semelhantes aos do nvm, mas o fnm é feito com Rust por debaixo dos panos, o que o torna mais rápido e eficiente, especialmente durante a inicialização do terminal.

Você pode conferir a lista completa de comandos na <a target="blank" href="https://github.com/Schniz/fnm/blob/master/docs/commands.md" class="dark:text-gray-100 dark:hover:text-gray-200">documentação oficial</a>.

Antes de mudar para fnm, o tempo de inicialização do meu terminal com nvm era de cerca de 2 ou 3 segundos. Depois de mudar para o fnm, o terminal carrega quase instantaneamente, como você pode ver abaixo:

<img src="/fnm-opening-terminal.gif" />

<h2 class="dark:text-white">NVM x FNM: a tecnologia por trás de cada ferramenta</h2>

<h3 class="dark:text-white">NVM (Node Version Manager)</h3>

O NVM tem sido uma ferramenta essencial para gerenciar versões do Node.js há muito tempo. Ela é escrita em `Bash`, uma linguagem de script de shell e opera manipulando as variáveis ​​de ambiente do seu shell sempre que você alterna entre as versões do Node.js. Embora funcione muito bem, o fato de ser escrito em Bash pode introduzir latência, especialmente em cenários com muitas versões ou ambientes de shell lentos.

<h3 class="dark:text-white">FNM (Fast Node Manager)</h3>

Por outro lado, o FNM é construído com Rust, uma linguagem de programação de sistemas conhecida por sua velocidade e eficiência de memória. Os benefícios de desempenho do Rust são imediatamente perceptíveis: o fnm não apenas lida com o gerenciamento de versões mais rapidamente, mas também executa comandos com menor sobrecarga em comparação com o nvm baseado em Bash. Isso torna o fnm uma escolha atraente para quem precisa de um gerenciador de versões do Node.js mais rápido e responsivo, especialmente para máquinas modernas com várias versões do Node.js instaladas.

<h2 class="dark:text-white">Conclusão</h2>

Depois de usar o fnm por alguns dias, posso dizer com segurança que é uma alternativa mais rápida e eficiente ao nvm, especialmente se você priorizar o desempenho durante a inicialização do terminal. O fato de ser escrito em Rust traz um aumento significativo de desempenho, e a sintaxe do comando é familiar para quem já está acostumado com nvm. Se você ainda não experimentou, recomendo fortemente que experimente.
