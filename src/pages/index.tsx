import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  { id: 'playwright-java', title: 'Playwright for Java', text: 'Zero code. The Page on your test is found: every action as a step, trace, screenshot, video.', guide: '/get-started/java/playwright' },
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
            <code>npm i -D reporting-labs@latest</code>
            <code>dev.reportinglabs · Maven Central</code>
            <code>pip install reporting-labs</code>
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

/* ---------- install in three steps ---------- */
const JAVA_VERSION = '0.1.24';

type Snip = { file: string; lines: string[]; typed?: boolean };
type Step = { title: string; text: string; snip: Snip; result?: string };

const NODE_STEPS: Record<'ts' | 'js', Step[]> = {
  ts: [
    { title: 'Install', text: 'One package. init writes a config with every option commented out.', snip: { file: 'terminal', typed: true, lines: ['npm i -D reporting-labs@latest', 'npx reporting-labs init'] } },
    { title: 'Add the reporter', text: 'One line in the Playwright config. That is the whole setup.', snip: { file: 'playwright.config.ts', lines: ["import reportingLabs from './reporting-labs.config';", '', 'export default defineConfig({', "  reporter: [['list'], ['reporting-labs', reportingLabs]],", '});'] } },
    { title: 'Run', text: 'Your usual command. The report is one HTML file next to your config.', snip: { file: 'terminal', typed: true, lines: ['npx playwright test'] }, result: 'reporting-labs/index.html' },
  ],
  js: [
    { title: 'Install', text: 'One package. init writes a config with every option commented out.', snip: { file: 'terminal', typed: true, lines: ['npm i -D reporting-labs@latest', 'npx reporting-labs init --js'] } },
    { title: 'Add the reporter', text: 'One line in the Playwright config. That is the whole setup.', snip: { file: 'playwright.config.js', lines: ["const reportingLabs = require('./reporting-labs.config');", '', 'module.exports = defineConfig({', "  reporter: [['list'], ['reporting-labs', reportingLabs]],", '});'] } },
    { title: 'Run', text: 'Your usual command. The report is one HTML file next to your config.', snip: { file: 'terminal', typed: true, lines: ['npx playwright test'] }, result: 'reporting-labs/index.html' },
  ],
};

const JAVA_TOOLS = [
  { id: 'selenium', label: 'Selenium', artifact: 'reporting-labs-selenium', note: 'zero-code Selenium steps and screenshots' },
  { id: 'playwright', label: 'Playwright', artifact: 'reporting-labs-playwright', note: 'finds your Page: steps, API calls, trace, screenshot' },
  { id: 'rest-assured', label: 'REST Assured', artifact: 'reporting-labs-rest-assured', note: 'every request in the API tab' },
  { id: 'cucumber', label: 'Cucumber', artifact: 'reporting-labs-cucumber', note: 'a row per scenario, Given/When/Then as steps' },
];

const dep = (artifact: string, comment: string) => [`<!-- ${comment} -->`, '<dependency>', '  <groupId>dev.reportinglabs</groupId>', `  <artifactId>${artifact}</artifactId>`, `  <version>${JAVA_VERSION}</version>`, '  <scope>test</scope>', '</dependency>'];

function javaSteps(framework: string, tools: string[]): Step[] {
  const junit = framework === 'junit5';
  const addOns = JAVA_TOOLS.filter(t => tools.includes(t.id));
  const cucumber = tools.includes('cucumber');
  const pom = [...dep(junit ? 'reporting-labs-junit5' : 'reporting-labs-testng', junit ? 'the reporter for JUnit 5' : 'the reporter for TestNG'), ...addOns.flatMap(t => dep(t.artifact, t.note))];
  const install: Step = {
    title: 'Add the dependencies',
    text: addOns.length ? 'The reporter for your framework, plus one add-on per tool. The add-ons are zero code: nothing changes in your tests.' : 'The reporter for your framework. Pick your tools above to add their zero-code add-ons.',
    snip: { file: 'pom.xml', lines: pom },
  };
  let wire: Step;
  if (cucumber) {
    wire = {
      title: 'Register the plugin',
      text: junit ? 'Two lines in the JUnit Platform properties: the Cucumber plugin and extension auto-detection.' : 'One line in the file your runner already reads. Your runner class stays what it is.',
      snip: junit
        ? { file: 'src/test/resources/junit-platform.properties', lines: ['cucumber.plugin=dev.reportinglabs.cucumber.ReportingLabsPlugin', 'junit.jupiter.extensions.autodetection.enabled=true'] }
        : { file: 'src/test/resources/cucumber.properties', lines: ['cucumber.plugin=dev.reportinglabs.cucumber.ReportingLabsPlugin'] },
    };
  } else if (junit) {
    wire = { title: 'Turn on auto-detection', text: 'One line in a properties file. No @ExtendWith on any class.', snip: { file: 'src/test/resources/junit-platform.properties', lines: ['junit.jupiter.extensions.autodetection.enabled=true'] } };
  } else {
    wire = { title: 'Nothing to wire', text: 'TestNG finds the listener through ServiceLoader. A properties file is optional, for a title or auto-open.', snip: { file: 'src/test/resources/reporting-labs.properties', lines: ['# optional', 'reporting-labs.title=Checkout regression', 'reporting-labs.open=on-failure'] } };
  }
  const run: Step = { title: 'Run', text: 'Your usual command. The report is one HTML file in the build folder.', snip: { file: 'terminal', typed: true, lines: ['mvn test'] }, result: 'target/reporting-labs/index.html' };
  return [install, wire, run];
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className={styles.copy} aria-label="Copy" onClick={() => {
      navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); });
    }}>{copied ? 'Copied' : 'Copy'}</button>
  );
}

/* A code block that plays when its step becomes active: shell lines are typed character by
   character, file contents appear line by line. Calls onDone once the animation has finished. */
function Snippet({ snip, active, instant, onDone }: { snip: Snip; active: boolean; instant: boolean; onDone: () => void }) {
  const full = snip.lines.join('\n');
  const [chars, setChars] = useState(instant ? full.length : 0);
  const [finished, setFinished] = useState(instant);
  useEffect(() => {
    if (!active || finished) return;
    if (instant) { setChars(full.length); setFinished(true); onDone(); return; }
    if (snip.typed) {
      let i = 0;
      const id = setInterval(() => {
        i += 1; setChars(i);
        if (i >= full.length) { clearInterval(id); setTimeout(() => { setFinished(true); onDone(); }, 350); }
      }, 32);
      return () => clearInterval(id);
    }
    const id = setTimeout(() => { setFinished(true); onDone(); }, snip.lines.length * 110 + 450);
    return () => clearTimeout(id);
  }, [active, finished, instant, snip, full, onDone]);
  const shown = snip.typed ? full.slice(0, chars) : full;
  const typing = snip.typed && active && !finished;
  return (
    <div className={`${styles.snip} ${snip.typed ? styles.term : ''}`}>
      <div className={styles.bar}><i /><i /><i /><span>{snip.file}</span><CopyButton text={full} /></div>
      <pre className={styles.snipBody}>
        {snip.typed ? (
          <code>
            {!active ? (
              <span className={styles.line}><span className={styles.prompt}>$ </span><span className={styles.cursor} /></span>
            ) : shown.split('\n').map((l, i, arr) => (
              <span key={i} className={styles.line}><span className={styles.prompt}>$ </span>{l}{i === arr.length - 1 && typing && <span className={styles.cursor} />}</span>
            ))}
          </code>
        ) : (
          <code>
            {snip.lines.map((l, i) => (
              <span key={i} className={`${styles.line} ${active || instant ? styles.lineOn : ''}`} style={{ animationDelay: `${i * 110}ms` }}>{l || ' '}</span>
            ))}
          </code>
        )}
      </pre>
    </div>
  );
}

function InstallColumn({ logo, name, note, variants, tools, steps, guide, label }: {
  logo: string; name: string; note: string; variants: { id: string; label: string }[]; tools?: { id: string; label: string }[];
  steps: (variant: string, tools: string[]) => Step[]; guide: string; label: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState(variants[0].id);
  const [picked, setPicked] = useState<string[]>(tools ? [tools[0].id] : []);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(0);            // number of steps whose snippet has finished
  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setStarted(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);
  const list = steps(variant, picked);
  const complete = done >= list.length;
  const key = `${variant}-${picked.join('+')}`;
  return (
    <div ref={ref} className={`${styles.col} ${complete ? styles.colDone : ''}`}>
      <div className={styles.colHead}>
        <img src={`/img/logos/${logo}.svg`} alt="" />
        <div className={styles.colTitle}><Heading as="h3">{name}</Heading><span>{note}</span></div>
        <div className={styles.toggle} role="tablist" aria-label={`${name} variant`}>
          {variants.map(v => (
            <button key={v.id} type="button" role="tab" aria-selected={variant === v.id} className={variant === v.id ? styles.toggleOn : ''} onClick={() => setVariant(v.id)}>{v.label}</button>
          ))}
        </div>
      </div>
      {tools && (
        <div className={styles.tools}>
          <span>Your tools</span>
          {tools.map(t => {
            const on = picked.includes(t.id);
            return <button key={t.id} type="button" aria-pressed={on} className={`${styles.chip} ${on ? styles.chipOn : ''}`} onClick={() => setPicked(p => on ? p.filter(x => x !== t.id) : [...p, t.id])}>{t.label}</button>;
          })}
        </div>
      )}
      <ol className={styles.steps}>
        <span className={styles.rail} aria-hidden="true"><span style={{ transform: `scaleY(${Math.min(done, list.length - 1) / (list.length - 1)})` }} /></span>
        {list.map((st, i) => {
          const active = started && done >= i;
          const stepDone = done > i;
          return (
            <li key={`${key}-${i}`} className={`${styles.step} ${active ? styles.stepOn : ''}`}>
              <span className={`${styles.num} ${stepDone ? styles.numDone : ''}`}>{stepDone ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}</span>
              <div className={styles.stepBody}>
                <div className={styles.stepTitle}>{st.title}</div>
                <p>{st.text}</p>
                <Snippet snip={st.snip} active={active} instant={reduced} onDone={() => setDone(d => Math.max(d, i + 1))} />
                {st.result && stepDone && (
                  <div className={styles.result}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>Report written to <code>{st.result}</code></div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className={styles.colFoot}>
        <span className={styles.foot}>{complete ? 'That is the whole setup.' : ' '}</span>
        <Link className="button button--primary" to={guide}>{label}</Link>
      </div>
    </div>
  );
}

function Install() {
  return (
    <section className={styles.install} id="install">
      <div className="container">
        <Heading as="h2" className={styles.h2}>Up and running in three steps</Heading>
        <p className={styles.lead}>No account, no server, no agent. Install the package, point your framework at it, run your tests as you always do.</p>
        <div className={styles.installGrid}>
          <InstallColumn logo="nodejs" name="Node.js" note="Playwright Test · JS or TS" variants={[{ id: 'ts', label: 'TypeScript' }, { id: 'js', label: 'JavaScript' }]} steps={v => NODE_STEPS[v as 'ts' | 'js']} guide="/get-started/nodejs" label="Node.js guide" />
          <InstallColumn logo="java" name="Java" note="TestNG or JUnit 5 · any tool" variants={[{ id: 'testng', label: 'TestNG' }, { id: 'junit5', label: 'JUnit 5' }]} tools={JAVA_TOOLS} steps={javaSteps} guide="/get-started/java" label="Java guide" />
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
            <pre className={styles.code}><code>{`npm i -D reporting-labs@latest
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
          <div className={styles.lang}>
            <div className={styles.langHead}><img src="/img/logos/python.svg" alt="" /><Heading as="h3">Python</Heading></div>
            <p>pytest plugin, on once installed, with zero-code Playwright and Selenium, plus a Robot Framework listener. Every requests and httpx call captured.</p>
            <pre className={styles.code}><code>{`pip install reporting-labs
pytest`}</code></pre>
            <Link className="button button--primary" to="/get-started/python">Python guide</Link>
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
          <a className="button button--secondary button--lg" href="https://github.com/naveenautomationlabs/reporting-labs-python">GitHub · Python</a>
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
        <Install />
        <Features />
        <Posters />
        <Languages />
        <Closing />
      </main>
    </Layout>
  );
}
