import { useState } from "react";
import { getRouteFromUrl, useTranslatedPath } from "../i18n/utils";
import { getLangFromUrl } from "../i18n/utils";

import { Brazil } from "../icons/brazil";
import { USA } from "../icons/usa";
import { Chevron } from "../icons/chevron";

export const LanguagePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const url =
    typeof window !== "undefined"
      ? new URL(window.location.href)
      : new URL("https://gabrielvrl.github.io/");

  const lang = getLangFromUrl(url);
  const translatePath = useTranslatedPath(lang);
  const route = getRouteFromUrl(url);
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{lang === "ptbr" ? <Brazil /> : <USA />}</span>
        <Chevron isOpen={isOpen} />
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 gap-1 bg-white">
          {lang === "ptbr" ? (
            <a
              href={translatePath(`/${route ? route : ""}`, "en")}
              className="block text-gray-700 hover:bg-gray-100 dark:bg-zinc-800"
              onClick={() => setIsOpen(false)}
            >
              <USA />
            </a>
          ) : (
            <a
              href={translatePath(`/${route ? route : ""}`, "ptbr")}
              className="block text-gray-700 hover:bg-gray-100 dark:bg-zinc-800"
              onClick={() => setIsOpen(false)}
            >
              <Brazil />
            </a>
          )}
        </ul>
      )}
    </div>
  );
};