import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.title}>{siteConfig.title}</Heading>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className={`button button--primary button--lg ${styles.cta}`} to="/get-started/javascript">Get started</Link>
          <Link className={`button button--secondary button--lg ${styles.cta}`} to="/features/overview">See features</Link>
        </div>
        <p className={styles.langs}>Available for <b>JavaScript / Playwright</b> · <b>Java / JUnit 5</b> · <b>Java / TestNG</b> · <em>Python coming</em></p>
      </div>
    </header>
  );
}

const FEATURES = [
  { title: 'One HTML file', text: 'The whole report is a single file. Share it on Slack, attach it to a ticket, download it from your CI. No server, no login, no expiry.' },
  { title: 'Priority-ranked failures', text: 'Tag a test with priority and owner; the report puts P0 breakages on top and the rest below. Triage in seconds.' },
  { title: 'Failure clusters', text: 'Thirty red tests that share one error read as one problem, not thirty. The report groups them by error message on its own.' },
  { title: 'Bug report button', text: 'One click copies a ready-to-paste ticket in Jira, Markdown or plain text — steps, environment, error, test data, all included.' },
  { title: 'History and trend', text: 'A small history file next to your config powers the trend chart, new-vs-known failures, flaky dots and duration regressions.' },
  { title: 'Sharding built in', text: 'Split your run across N shards for speed; a single `reporting-labs merge` command joins them into one report.' },
];

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.grid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.card}>
              <Heading as="h3">{f.title}</Heading>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OneReport() {
  return (
    <section className={styles.oneReport}>
      <div className="container">
        <Heading as="h2">One report shape, three languages</Heading>
        <p>reportingLabs generates the exact same HTML from every supported test framework, because every language port renders from the same shared template. The report a Java team opens is byte-for-byte the report a JavaScript team opens.</p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero />
      <main>
        <Features />
        <OneReport />
      </main>
    </Layout>
  );
}
