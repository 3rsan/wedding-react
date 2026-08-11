import classic from './classic';
import modernMinimal from './modern-minimal';

export const THEMES = {
  classic,
  'modern-minimal': modernMinimal,
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(themeId) {
  return THEMES[themeId] || THEMES.classic;
}
