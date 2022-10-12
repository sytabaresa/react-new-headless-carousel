import { clientPlugin, defineConfig } from '@vitebook/client/node';
import { preactMarkdownPlugin } from '@vitebook/markdown-preact/node';
import { preactPlugin } from '@vitebook/preact/node';
import { defaultThemePlugin, DefaultThemeConfig } from '@vitebook/theme-default/node';

export default defineConfig<DefaultThemeConfig>({
  include: ['src/**/*.md', 'src/**/*.story.{jsx,tsx}'],
  plugins: [
    preactMarkdownPlugin(),
    preactPlugin({ appFile: 'App.tsx' }),
    clientPlugin(),
    defaultThemePlugin(),
  ],
  site: {
    title: 'React Headless Carousel',
    description: '',
    theme: {},
  },
});
