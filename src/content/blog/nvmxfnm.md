---
title: "NVM x FNM: Comparing Node.js Version Managers"
description: ""
pubDate: "Feb 23 2025"
heroImage: "/nodejs.png"
---

A few days ago, I came across a post on my LinkedIn feed discussing <a target="blank" href="https://github.com/Schniz/fnm" class="dark:hover:text-gray-700">`fnm`</a>, a tool developed with <a target="blank" href="https://www.rust-lang.org/" class="dark:hover:text-gray-700">`Rust`</a> for Node.js version management that promised faster performance than <a target="blank" href="https://github.com/nvm-sh/nvm" class="dark:hover:text-gray-700">`nvm`</a>, the tool I’ve been using for years.

Unfortunately, I couldn't find the original post URL to link it here, but I’ll summarize it's points and share my thoughts after using fnm for a few days instead of nvm.

I usually don't fall for the hype around new technologies, but this was the first time I truly saw the power of Rust. The post mentioned something like "your terminal could be slow because of NVM," and that really resonated with me. For most of my career, I didn’t have a super powerful computer, but recently, I upgraded to a MacBook Pro M1 Max with 32 GB of RAM—quite a powerhouse! Despite the specs, I still noticed my terminal would open slowly for the first time, though after the initial load, it would work fine.

With this in mind, I decided to give fnm a shot.

<h2 class="dark:text-white">Uninstalling NVM</h2>

First things first, I had to uninstall nvm. Honestly, it was a bit of a hassle, but the following command did the job:

```bash
rm -rf $NVM_DIR ~/.npm ~/.bower
```

Then I removed any mention to nvm in my .zshrc file, and ran:

```bash
source ~/.zshrc
```

This ensured that nvm was completely removed from my setup and that the terminal would load the new configuration.

<h2 class="dark:text-white">Installing FNM</h2>

Installing fnm was really simple. I ran the following command to get it up and running:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

<h2 class="dark:text-white">Configuring the Shell</h2>

After installing, I had to finish the setup for my shell. Since I use Oh My Zsh, I added this line:

```bash
eval "$(fnm env --use-on-cd --shell zsh)"
```

Now that fnm is configured, I was ready to install the Node.js version I wanted and start using it:

```bash
fnm install --lts
```

From my experience, the commands for fnm are really similar to nvm, but they are built with Rust under the hood, which makes them faster and more efficient, especially during terminal startup.

You can check out the complete list of commands in the <a target="blank" href="https://github.com/Schniz/fnm/blob/master/docs/commands.md" class="dark:text-gray-100 dark:hover:text-gray-200">official documentation</a>.

Before switching to fnm, my terminal startup time with nvm was around 2 or 3 seconds. After switching to fnm, however, the terminal loads almost instantly, as you can see below:

<img src="/fnm-opening-terminal.gif" />

<h2 class="dark:text-white">NVM x FNM: The Technology Behind Each Tool</h2>

<h3 class="dark:text-white">NVM (Node Version Manager)</h3>

NVM has been a go-to tool for managing Node.js versions for a long time. It’s written in `Bash`, a shell scripting language, and operates by manipulating the environment variables of your shell whenever you switch between Node.js versions. While it works great, the fact that it’s written in Bash can introduce some latency, especially in scenarios with a lot of versions or slow shell environments.

<h3 class="dark:text-white">FNM (Fast Node Manager)</h3>

On the other hand, FNM is built with Rust, a systems programming language known for it's speed and memory efficiency. The performance benefits of Rust are immediately noticeable: not only does fnm handle version management faster, but it also executes commands with lower overhead compared to the Bash-based nvm. This makes fnm an appealing choice for those who need a quicker and more responsive Node.js version manager, especially for modern machines with multiple versions of Node.js installed.

<h2 class="dark:text-white">Conclusion</h2>

After using fnm for a few days, I can confidently say it’s a faster, more efficient alternative to nvm, especially if you prioritize performance during terminal startup. The fact that it's written in Rust brings a significant performance boost, and the command syntax is familiar for those who are already used to nvm. If you haven’t tried it yet, I highly recommend giving it a go.
