import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default <Partial<Config>>{
  mode: 'jit',
  darkMode: 'class',
  content: [
    `components/**/*.{vue,js,ts}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `app.vue`,
    `plugins/**/*.{js,ts}`,
    `nuxt.config.{js,ts}`,
  ],
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    extend: {
      colors: {
        primary: colors.sky['600'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
