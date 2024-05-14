import { useState } from "react";
import { Chevron } from "../icons/chevron";
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
      <button
        aria-label="Open menu"
        className="hidden max-sm:block"
        onClick={handleClick}
      >
        <Chevron rotate={rotate} />
      </button>
      {rotate && (
        <>
          <div
            className={`${
              rotate
                ? "delay-2000 opacity-100 transition-opacity duration-1000 ease-linear"
                : "delay-2000 opacity-0 transition-opacity duration-1000 ease-linear"
            } fixed inset-0 z-50 bg-zinc-800/40 opacity-100 backdrop-blur-sm dark:bg-black/80 max-sm:block`}
            aria-hidden="true"
            onClick={handleClick}
          />
          <div
            className={
              `
              animate-bounce 
            fixed inset-x-4 top-10 z-50 hidden origin-top scale-100 rounded-3xl bg-white p-8 opacity-100 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800 max-sm:block`}
          >
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
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <h2 className="m-0 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t("nav.title")}
              </h2>
            </div>
            <nav className="mt-4">
              <ul className="grid grid-cols-1 text-base">
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
