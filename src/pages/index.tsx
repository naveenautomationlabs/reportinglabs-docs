import { useEffect, useState, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const TOOLS = [
  { name: 'Playwright', logo: 'playwright' },
  { name: 'TypeScript', logo: 'typescript' },
  { name: 'Node.js', logo: 'nodejs' },
  { name: 'TestNG', logo: 'testng' },
  { name: 'JUnit 5', logo: 'junit5' },
  { name: 'Selenium', logo: 'selenium' },
  { name: 'REST Assured', logo: 'restassured' },
  { name: 'Appium', logo: 'appium' },
  { name: 'Cucumber', logo: 'cucumber' },
  { name: 'Java', logo: 'java' },
];

const POSTERS = [
  { id: 'nodejs', title: 'Playwright · Node.js', text: 'The Playwright reporter for JavaScript and TypeScript. npm install, one line in the config.', guide: '/get-started/nodejs' },
  { id: 'java', title: 'Java, the whole stack', text: 'Seven Maven artifacts, one report. Pick your framework, add your tool.', guide: '/get-started/java' },
  { id: 'testng', title: 'TestNG', text: 'Listener found through ServiceLoader. Hooks, retries, DataProvider rows.', guide: '/get-started/java' },
  { id: 'junit5', title: 'JUnit 5', text: 'Extension auto-detected. Parameterized tests, assumptions, nested classes.', guide: '/get-started/java' },
  { id: 'selenium', title: 'Selenium', text: 'Zero code. Every open, click and type as a step; screenshots per policy.', guide: '/get-started/java/selenium' },
  { id: 'rest-assured', title: 'REST Assured', text: 'Zero code. Every request in the API tab with headers, bodies and cURL.', guide: '/get-started/java/rest-assured' },
  { id: 'playwright-java', title: 'Playwright for Java', text: 'Zero code. The Page on your test is found: trace, screenshot, video. API tests get every call.', guide: '/get-started/java/playwright' },
  { id: 'appium', title: 'Appium', text: 'Android and iOS drivers through the Selenium add-on. Taps as steps.', guide: '/get-started/java/other-tools' },
  { id: 'cucumber', title: 'Cucumber JVM', text: 'One property. A row per scenario, Given/When/Then as steps, tags as filters.', guide: '/get-started/java/cucumber' },
];

const FEATURES = [
  { title: 'One HTML file', text: 'The whole report is a single file. Attach it to a ticket, drop it in Slack, download it from CI. No server, no login, no expiry.' },
  { title: 'Failures, explained', text: 'The failing line, a code snippet and a plain-language reason: element not found, assertion with expected vs actual, site unreachable, hook failed.' },
  { title: 'Ranked by priority', text: 'Tag a test with priority, severity and owner. P0 breakages sit on top of the Overview; the rest wait below.' },
  { title: 'Failure clusters', text: 'Thirty red tests that share one error read as one problem. The report groups them by root cause on its own.' },
  { title: 'History and trend', text: 'A small JSON file next to your config powers the trend chart, new vs known failures, flaky dots and got-slower detection.' },
  { title: 'Secrets masked', text: 'Passwords, tokens, cookies and auth headers become **** in logs, request bodies, error messages and test data.' },
  { title: 'Every API call', text: 'Method, URL, status, timing, headers and bodies for each request the test made, with Copy as cURL.' },
  { title: 'Bug report button', text: 'One click copies a ticket for Jira, Markdown or plain text: steps, environment, error, test data, all included.' },
  { title: 'Sharding and merge', text: 'Split a run across shards for speed; one merge command joins them into a single report.' },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>Open source · MIT · Node.js and Java</div>
          <Heading as="h1" className={styles.title}>One HTML report for your <span>whole test stack</span>.</Heading>
          <p className={styles.tagline}>
            Playwright, Selenium, REST Assured, Cucumber, TestNG, JUnit 5. Same report from every one of them:
            failures ranked and explained, every API call, screenshots, traces and videos, history across runs.
            Secrets masked. Nothing to host.
          </p>
          <div className={styles.buttons}>
            <Link className={`button button--primary button--lg ${styles.cta}`} to="/get-started/nodejs">Get started · Node.js</Link>
            <Link className={`button button--secondary button--lg ${styles.cta}`} to="/get-started/java">Get started · Java</Link>
          </div>
          <div className={styles.installs}>
            <code>npm i -D reporting-labs</code>
            <code>dev.reportinglabs · Maven Central</code>
          </div>
        </div>
        <div className={styles.heroShot}>
          <div className={styles.frame}>
            <div className={styles.bar}><i /><i /><i /><span>reporting-labs/index.html</span></div>
            <img className={styles.lightOnly} src="/img/screenshots/01-overview-light.png" alt="reportingLabs report, Overview tab" />
            <img className={styles.darkOnly} src="/img/screenshots/01-overview-dark.png" alt="reportingLabs report, Overview tab, dark theme" />
          </div>
        </div>
      </div>
    </header>
  );
}

function ToolStrip() {
  return (
    <section className={styles.strip}>
      <div className="container">
        <div className={styles.stripTitle}>Works with the tools you already run</div>
        <div className={styles.stripRow}>
          {TOOLS.map(t => (
            <div key={t.name} className={styles.stripItem}>
              <div className={styles.stripLogo}><img src={`/img/logos/${t.logo}.svg`} alt={t.name} /></div>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.h2}>What the report gives you</Heading>
        <p className={styles.lead}>Built for the person who opens the report at 9am after a nightly run: what broke, why, who owns it, and is it new.</p>
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

function Posters() {
  const [open, setOpen] = useState<null | typeof POSTERS[number]>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  return (
    <section className={styles.posters} id="posters">
      <div className="container">
        <Heading as="h2" className={styles.h2}>Pick your stack</Heading>
        <p className={styles.lead}>One poster per tool: the install, what lands in the report, and the report itself. Open one, share it with your team.</p>
        <div className={styles.posterGrid}>
          {POSTERS.map(p => (
            <div key={p.id} className={styles.poster}>
              <button type="button" className={styles.posterImg} onClick={() => setOpen(p)} aria-label={`Open the ${p.title} poster`}>
                <img src={`/img/posters/${p.id}-thumb.webp`} alt={`${p.title} poster`} loading="lazy" width={600} height={750} />
              </button>
              <div className={styles.posterBody}>
                <Heading as="h3">{p.title}</Heading>
                <p>{p.text}</p>
                <div className={styles.posterLinks}>
                  <Link to={p.guide}>Guide</Link>
                  <a href={`/img/posters/${p.id}.webp`} target="_blank" rel="noopener">Full size</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {open && (
        <div className={styles.lightbox} onClick={() => setOpen(null)} role="dialog" aria-label={`${open.title} poster`}>
          <button type="button" className={styles.close} aria-label="Close" onClick={() => setOpen(null)}>×</button>
          <img src={`/img/posters/${open.id}.webp`} alt={`${open.title} poster`} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

function Languages() {
  return (
    <section className={styles.langs}>
      <div className="container">
        <Heading as="h2" className={styles.h2}>Same report, every language</Heading>
        <p className={styles.lead}>Every port renders the same HTML template. The report a Java team opens is byte-for-byte the report a JavaScript team opens, so one triage habit works across the company.</p>
        <div className={styles.langGrid}>
          <div className={styles.lang}>
            <div className={styles.langHead}><img src="/img/logos/nodejs.svg" alt="" /><Heading as="h3">Node.js</Heading></div>
            <p>Playwright Test reporter for JavaScript and TypeScript. Automatic API capture, trace and video attachments, sharding and merge.</p>
            <pre className={styles.code}><code>{`npm i -D reporting-labs
npx reporting-labs init`}</code></pre>
            <Link className="button button--primary" to="/get-started/nodejs">Node.js guide</Link>
          </div>
          <div className={styles.lang}>
            <div className={styles.langHead}><img src="/img/logos/java.svg" alt="" /><Heading as="h3">Java</Heading></div>
            <p>TestNG and JUnit 5 bindings with zero-code add-ons for Selenium, REST Assured and Playwright, one property for Cucumber.</p>
            <pre className={styles.code}><code>{`<groupId>dev.reportinglabs</groupId>
<artifactId>reporting-labs-testng</artifactId>`}</code></pre>
            <Link className="button button--primary" to="/get-started/java">Java guide</Link>
          </div>
          <div className={`${styles.lang} ${styles.langSoon}`}>
            <div className={styles.langHead}><img src="/img/logos/python.svg" alt="" /><Heading as="h3">Python</Heading></div>
            <p>pytest and Playwright for Python are next. Same template, same report.</p>
            <pre className={styles.code}><code>{`# coming`}</code></pre>
            <Link className="button button--secondary" to="/get-started/python">Roadmap</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className={styles.closing}>
      <div className="container">
        <Heading as="h2">Free, open source, no account.</Heading>
        <p>MIT licensed. The report is a file you own; nothing leaves your machine or your CI.</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/features/report-tour">Take the report tour</Link>
          <a className="button button--secondary button--lg" href="https://github.com/naveenautomationlabs/reporting-labs">GitHub · Node.js</a>
          <a className="button button--secondary button--lg" href="https://github.com/naveenautomationlabs/reporting-labs-java">GitHub · Java</a>
        </div>
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
        <ToolStrip />
        <Features />
        <Posters />
        <Languages />
        <Closing />
      </main>
    </Layout>
  );
}
