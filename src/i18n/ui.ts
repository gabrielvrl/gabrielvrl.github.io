type UIType = {
  en: {
    [key: string]: string;
  };
  ptbr: {
    [key: string]: string;
  };
};

export const languages = {
  en: 'English',
  ptbr: 'Português',
};

export const routes: UIType = {
  en: {
    'home': '',
    'blog': 'blog',
    'about': 'about',
  },
  ptbr: {
    'home': '',
    'blog': 'blog',
    'about': 'about',
  },
}

export const defaultLang: keyof UIType = 'en';

export const ui: UIType = {
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.title': 'Navigation',
  },
  ptbr: {
    'nav.about': 'Sobre mim',
    'nav.title': 'Navegação',
  },
};

export const showDefaultLang = false;

