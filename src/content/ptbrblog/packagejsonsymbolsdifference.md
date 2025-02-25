---
title: "Entendendo o Versionamento de Dependências no package.json do React Native: ^, ~ e Mais"
description: ""
pubDate: "Feb 25 2025"
heroImage: "/packagejson.png"
---

Ao trabalhar com React Native, ou qualquer projeto JavaScript que use o npm (Node Package Manager)\*, você frequentemente verá intervalos de versões especificados no seu arquivo `package.json`. Dois dos símbolos mais comuns que você encontrará são o acento circunflexo (`^`) e o til (`~`). Esses símbolos ajudam a gerenciar quais versões de uma dependência seu projeto é compatível. Neste post, vamos explorar as diferenças entre esses dois símbolos, o que acontece quando não há símbolo algum e se existem outros símbolos que você deve conhecer.

<h2>1. O que significa ^ (Acento Circunflexo)?</h2>

O acento circunflexo (`^`) é um dos símbolos mais usados em um arquivo package.json. Ele diz ao npm para instalar a versão mais recente que seja compatível com a versão especificada, mas dentro da mesma versão principal.

Por exemplo:

```json
"dependencies": {
  "react-native": "^0.70.0"
}
```

Neste caso, `^0.70.0` significa que o npm pode atualizar para qualquer versão que seja maior ou igual a `0.70.0`, mas menor que `1.0.0`. O ponto chave aqui é que a versão principal (`0` neste caso) não mudará. Isso permite que você receba correções de bugs e atualizações menores sem o risco de mudanças que possam quebrar seu código.

<h2>2. O que significa ~ (Til)?</h2>

O til (`~`) é semelhante ao acento circunflexo, mas tem um intervalo mais restrito. Ela diz ao npm para instalar a versão mais recente que seja compatível dentro da versão menor especificada.

Por exemplo:

```json
"dependencies": {
  "react-native": "~0.70.0"
}
```

Neste caso, `~0.70.0` significa que o npm pode instalar qualquer versão que seja maior ou igual a `0.70.0`, mas menor que `0.71.0`. Isso permite atualizações que incluem correções de bugs, mas não novas funcionalidades ou mudanças que possam quebrar o código, que poderiam vir com uma atualização da versão menor.

<h2>3. E se não houver nenhum símbolo?</h2>

Se você não especificar um símbolo antes do número da versão, o npm instalará apenas aquela versão específica. Isso é útil quando você quer bloquear uma dependência em uma versão específica e evitar atualizações, o que poderia causar problemas de compatibilidade.

Por exemplo:

```json
"dependencies": {
  "react-native": "0.70.0"
}
```

Neste caso, o `react-native` será sempre instalado na versão `0.70.0`. Ele não será atualizado automaticamente para nenhuma versão mais recente, mesmo que uma atualização de patch ou versão menor esteja disponível.

<h2>4. Existem outros símbolos aos quais devemos prestar atenção?</h2>

Sim, existem alguns outros símbolos que você pode encontrar, e eles controlam os intervalos de versões de maneiras diferentes:

- `>` (Maior que): Instala uma versão maior que a versão especificada.

  Exemplo: `"react-native": ">0.70.0"`

* `>=` (Maior ou igual a): Instala uma versão maior ou igual à versão especificada.

  Exemplo: `"react-native": ">=0.70.0"`

* `<` (Menor que): Instala uma versão menor que a versão especificada.

  Exemplo: `"react-native": "<0.70.0"`

* `<=` (Menor ou igual a): Instala uma versão menor ou igual à versão especificada.

  Exemplo: `"react-native": "<=0.70.0"`

- `*` (Coringa): Instala a versão mais recente da dependência, independentemente das versões principais, menores ou de patch.

  Exemplo: `"react-native": "*"`

<h2>5. Por que o versionamento é importante no React Native?</h2>

O versionamento é essencial para garantir compatibilidade e estabilidade no seu projeto. O React Native e suas dependências podem mudar rapidamente, e você quer ter certeza de que está utilizando versões que funcionam corretamente juntas. Ao usar os símbolos de acento circunflexo (`^`) ou til (`~`), você permite que seu projeto se beneficie de atualizações importantes sem sacrificar a estabilidade.

No entanto, se você está trabalhando em um projeto que exige controle rigoroso sobre as dependências, você pode optar por bloquear as versões para versões específicas, a fim de evitar problemas inesperados com atualizações.

<h2>Conclusão</h2>

Em resumo, entender como o npm lida com o versionamento através de símbolos como `^` e `~` é importante para manter o controle sobre as dependências do seu projeto React Native. O acento circunflexo (`^`) permite atualizações menores e correções de bugs, enquanto o til (`~`) limita as atualizações apenas a versões de patch. Não usar nenhum símbolo bloqueia seu projeto a uma versão específica, impedindo atualizações, a menos que sejam feitas manualmente.

Ao dominar o versionamento no seu `package.json`, você pode garantir um ambiente de desenvolvimento mais confiável e consistente para seus projetos React Native.

---

**Nota**: Embora este post tenha se referido principalmente ao npm, as regras de versionamento com `^`, `~` e outros símbolos também se aplicam ao `Yarn`, `pnpm` e outros gerenciadores de pacotes, pois eles seguem a mesma abordagem para gerenciar dependências no arquivo package.json. Portanto, independentemente do gerenciador de pacotes que você escolher, os conceitos apresentados aqui são universais.
