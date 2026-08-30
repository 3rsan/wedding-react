import classic from './classic';
import modernMinimal from './modern-minimal';
import vintage from './vintage';
import botanical from './botanical';
import luxuryDark from './luxury-dark';
import editorial from './editorial';

export const THEMES = {
  classic,
  'modern-minimal': modernMinimal,
  vintage,
  botanical,
  'luxury-dark': luxuryDark,
  editorial,
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(themeId) {
  return THEMES[themeId] || THEMES.classic;
}
