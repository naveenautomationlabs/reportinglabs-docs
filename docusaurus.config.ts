import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'reportingLabs',
  tagline: 'One HTML test report for your whole stack: Playwright, Selenium, REST Assured, Cucumber, TestNG, JUnit 5. Node.js and Java.',
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
        { to: '/support', label: '♥ Support', position: 'right' },
        {
          label: 'GitHub', position: 'right',
          items: [
            { label: 'reporting-labs (Node.js)', href: 'https://github.com/naveenautomationlabs/reporting-labs' },
            { label: 'reporting-labs-java', href: 'https://github.com/naveenautomationlabs/reporting-labs-java' },
            { label: 'reporting-labs-python', href: 'https://github.com/naveenautomationlabs/reporting-labs-python' },
            { label: 'reportinglabs-docs (this site)', href: 'https://github.com/naveenautomationlabs/reportinglabs-docs' },
          ],
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Node.js', to: '/get-started/nodejs' },
            { label: 'Java', to: '/get-started/java' },
            { label: 'Python', to: '/get-started/python' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'All options', to: '/reference/options' },
            { label: 'CI recipes', to: '/ci/github-actions' },
            { label: 'Sharding & merge', to: '/features/sharding' },
            { label: 'Security & privacy', to: '/security-privacy' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub: reporting-labs (Node.js)', href: 'https://github.com/naveenautomationlabs/reporting-labs' },
            { label: 'GitHub: reporting-labs-java', href: 'https://github.com/naveenautomationlabs/reporting-labs-java' },
            { label: 'GitHub: reporting-labs-python', href: 'https://github.com/naveenautomationlabs/reporting-labs-python' },
            { label: 'npm: reporting-labs', href: 'https://www.npmjs.com/package/reporting-labs' },
            { label: 'PyPI: reporting-labs', href: 'https://pypi.org/project/reporting-labs/' },
            { label: 'Maven Central: dev.reportinglabs', href: 'https://central.sonatype.com/namespace/dev.reportinglabs' },
            { label: 'Issues (Node.js)', href: 'https://github.com/naveenautomationlabs/reporting-labs/issues' },
            { label: 'Issues (Java)', href: 'https://github.com/naveenautomationlabs/reporting-labs-java/issues' },
            { label: 'Issues (Python)', href: 'https://github.com/naveenautomationlabs/reporting-labs-python/issues' },
            { label: '♥ Support reportingLabs', to: '/support' },
          ],
        },
      ],
      copyright: `MIT licensed. Copyright © ${new Date().getFullYear()} reportingLabs.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula, additionalLanguages: ['java', 'yaml', 'groovy'] },
  } satisfies Preset.ThemeConfig,
};

export default config;
