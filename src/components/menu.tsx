import { useState } from "react";
import { Chevron } from "../icons/chevron";
import HeaderLink from "./HeaderLink.astro";
import {
  getLangFromUrl,
  useTranslatedPath,
  useTranslations,
} from "../i18n/utils";

export const Menu = () => {
  const [rotate, setRotate] = useState(false);

  const url = new URL(window.location.href);
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);
  const translatePath = useTranslatedPath(lang);

  const handleClick = () => {
    setRotate(!rotate);
  };

  return (
    <>
      <button className="hidden max-sm:block" onClick={handleClick}>
        <Chevron rotate={rotate} />
      </button>
      {rotate && (
        <>
          <div
            className="fixed inset-0 z-50 hidden bg-zinc-800/40 opacity-100 backdrop-blur-sm dark:bg-black/80 max-sm:block"
            id="headlessui-popover-overlay-:r0:"
            aria-hidden="true"
            data-headlessui-state="open"
            onClick={handleClick}
          ></div>
          <div className="w-auto fixed inset-x-4 top-8 z-50 hidden origin-top scale-100 rounded-3xl bg-white p-8 opacity-100 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800 max-sm:block">
            <div className="flex flex-row-reverse items-center justify-between">
              <button
                aria-label="Close menu"
                className="-m-1 p-1"
                type="button"
                onClick={handleClick}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
                >
                  <path
                    d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t("nav.title")}
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                <li>
                  <a className="block py-2" href={translatePath("/")}>
                    {t("nav.home")}
                  </a>
                </li>
                <li>
                  <a className="block py-2" href={translatePath("/blog")}>
                    {t("nav.blog")}
                  </a>
                </li>
                <li>
                  <a className="block py-2" href={translatePath("/about")}>
                    {t("nav.about")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
};
