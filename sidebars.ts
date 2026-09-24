import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  main: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: [
        'get-started/javascript',
        'get-started/java-junit5',
        'get-started/java-testng',
        'get-started/python',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'features/overview',
        'features/meta',
        'features/failure-clusters',
        'features/bug-report',
        'features/history-trend',
        'features/sharding',
        'features/plain-language-errors',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/options', 'reference/api'],
    },
    {
      type: 'category',
      label: 'CI recipes',
      items: ['ci/github-actions', 'ci/jenkins', 'ci/gitlab'],
    },
    {
      type: 'category',
      label: 'Compare',
      items: ['compare/allure-playwright'],
    },
  ],
};

export default sidebars;
