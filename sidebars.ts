import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Common blocks reused across per-language sidebars. Features / Reference / CI /
// Compare describe the report itself — they are language-agnostic, so every
// language sidebar shows the same set.
const commonAfterGetStarted = [
  {
    type: 'category' as const,
    label: 'Features',
    collapsed: false,
    items: [
      'features/overview',
      'features/report-tour',
      'features/meta',
      'features/failure-clusters',
      'features/bug-report',
      'features/history-trend',
      'features/sharding',
      'features/graphs',
      'features/plain-language-errors',
    ],
  },
  {
    type: 'category' as const,
    label: 'Reference',
    items: ['reference/options', 'reference/api'],
  },
  {
    type: 'category' as const,
    label: 'CI recipes',
    items: ['ci/github-actions', 'ci/jenkins', 'ci/gitlab'],
  },
  {
    type: 'category' as const,
    label: 'Compare',
    items: ['compare/allure-playwright'],
  },
];

const sidebars: SidebarsConfig = {
  nodejs: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: ['get-started/nodejs'],
    },
    ...commonAfterGetStarted,
  ],
  java: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: ['get-started/java-junit5', 'get-started/java-testng'],
    },
    ...commonAfterGetStarted,
  ],
  python: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: ['get-started/python'],
    },
    ...commonAfterGetStarted,
  ],
};

export default sidebars;
