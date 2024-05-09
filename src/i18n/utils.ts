import { ui, defaultLang, showDefaultLang, routes } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll("/", "");
    const hasTranslation =
      defaultLang !== l &&
      routes[l as keyof typeof routes] !== undefined &&
      routes[l as keyof typeof routes][pathName] !== undefined;
    const translatedPath = hasTranslation
      ? "/" + routes[l as keyof typeof routes][pathName]
      : path;

    return !showDefaultLang && l === defaultLang
      ? translatedPath
      : `/${l}${translatedPath}`;
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  console.log("url", url);
  const pathname = new URL(url).pathname;
  console.log("pathname", pathname);
  const parts = pathname?.split("/");
  console.log("parts", parts);
  const path = parts.pop() || parts.pop();
  console.log("path", path);

  if (path === undefined) {
    return undefined;
  }

  if (pathname.startsWith("/blog/") || pathname.startsWith("/ptbr/blog/")) {
    return `blog/${path}`;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    return route[path] !== undefined ? route[path] : undefined;
  }

  const getKeyByValue = (
    obj: Record<string, string>,
    value: string,
  ): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}