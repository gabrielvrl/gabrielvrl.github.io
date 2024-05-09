import { getRouteFromUrl, useTranslatedPath } from "../i18n/utils";
import { getLangFromUrl } from "../i18n/utils";

import { Brazil } from "../icons/brazil";
import { USA } from "../icons/usa";

export const LanguagePicker = () => {
  const url =
    typeof window !== "undefined"
      ? new URL(window.location.href)
      : new URL("https://gabrielvrl.github.io/");
  
  const route = getRouteFromUrl(url);
  const lang = getLangFromUrl(url);
  const translatePath = useTranslatedPath(lang);

  return (
    <div className="relative">
      {lang === "ptbr" ? (
        <a
          href={translatePath(`/${route ? route : ""}`, "en")}
          className="block text-gray-700 dark:bg-zinc-800"
          aria-label="Go to the English version of the website"
        >
          <USA />
        </a>
      ) : (
        <a
          href={translatePath(`/${route ? route : ""}`, "ptbr")}
          className="block text-gray-700 dark:bg-zinc-800"
          aria-label="Ir para a versão em português do site"
        >
          <Brazil />
        </a>
      )}
    </div>
  );
};
