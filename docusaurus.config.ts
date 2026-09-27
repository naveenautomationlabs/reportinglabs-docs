import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'reportingLabs',
  tagline: 'One beautiful test report in a single HTML file — for JavaScript, Java, and more.',
  favicon: 'img/favicon.svg',

  url: 'https://reportinglabs.dev',
  baseUrl: '/',

  organizationName: 'naveenautomationlabs',
  projectName: 'reportinglabs-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',                        // docs at the root, no /docs prefix
          editUrl: 'https://github.com/naveenautomationlabs/reportinglabs-docs/edit/main/',
        },
        blog: false,                                  // skip for v1
        theme: { customCss: './src/css/custom.css' },
        sitemap: { changefreq: 'weekly', priority: 0.5 },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    navbar: {
      title: 'reportingLabs',
      logo: { alt: 'reportingLabs logo', src: 'img/logo.svg' },
      items: [
        { to: '/features/report-tour', label: 'Report tour', position: 'left' },
        { type: 'docSidebar', sidebarId: 'nodejs', label: 'Node.js', position: 'left' },
        { type: 'docSidebar', sidebarId: 'java', label: 'Java', position: 'left' },
        { type: 'docSidebar', sidebarId: 'python', label: 'Python', position: 'left' },
        { href: 'https://github.com/naveenautomationlabs/reporting-labs', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Node.js (JS & TS)', to: '/get-started/nodejs' },
            { label: 'Java (Playwright, Selenium, REST Assured)', to: '/get-started/java' },
            { label: 'Python (coming)', to: '/get-started/python' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'All options', to: '/reference/options' },
            { label: 'CI recipes', to: '/ci/github-actions' },
            { label: 'Sharding & merge', to: '/features/sharding' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/naveenautomationlabs/reporting-labs' },
            { label: 'npm', href: 'https://www.npmjs.com/package/reporting-labs' },
            { label: 'Issues', href: 'https://github.com/naveenautomationlabs/reporting-labs/issues' },
          ],
        },
      ],
      copyright: `MIT licensed. Copyright © ${new Date().getFullYear()} reportingLabs.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula, additionalLanguages: ['java', 'yaml', 'groovy'] },
  } satisfies Preset.ThemeConfig,
};

export default config;
