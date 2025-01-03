type UIType = {
  en: {
    [key: string]: string;
  };
  ptbr: {
    [key: string]: string;
  };
};

export const languages = {
  en: "English",
  ptbr: "Português",
};

export const routes: UIType = {
  en: {
    home: "",
    about: "about",
  },
  ptbr: {
    home: "",
    about: "about",
  },
};

export const defaultLang: keyof UIType = "en";

export const ui: UIType = {
  en: {
    "nav.home": "Home",
    "nav.books": "Books",
    "nav.about": "About me",
    "nav.title": "Navigation",
  },
  ptbr: {
    "nav.books": "Livros",
    "nav.about": "Sobre mim",
    "nav.title": "Navegação",
  },
};

export const showDefaultLang = false;
