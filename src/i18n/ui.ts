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

export const defaultLang: keyof UIType = 'ptbr';

export const ui: UIType = {
  en: {
    'nav.about': 'About',
  },
  ptbr: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'Sobre mim',
  },
};

export const showDefaultLang = false;

