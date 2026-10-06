import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './support.module.css';

// Hosted payment pages: the site only links to them, so it loads no payment scripts and never sees card details.
const RAZORPAY_URL = 'https://rzp.io/rzp/ddufUFxC';   // Razorpay Payment Page with "customer decides amount" (INR, UPI)
const STRIPE_URL = 'https://donate.stripe.com/9B628r8Dz8EV71I4nBenS25';

function PayCard({ title, cur, text, url, label, via }: { title: string; cur: string; text: string; url: string; label: string; via: string }): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <Heading as="h2" className={styles.cardTitle}>{title}</Heading>
        <span className={styles.cur}>{cur}</span>
      </div>
      <p className={styles.cardText}>{text}</p>
      {url
        ? <a className={`button button--primary button--lg ${styles.pay}`} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
        : <div className={styles.soon}>Coming soon</div>}
      <p className={styles.via}>{via}</p>
    </div>
  );
}

export default function Support(): ReactNode {
  return (
    <Layout title="Support reportingLabs" description="reportingLabs is free and open source. If it saves your team time, you can support its development.">
      <main className={styles.page}>
        <div className={`container ${styles.wrap}`}>
          <div className={styles.eyebrow}>Free · Open source · MIT</div>
          <Heading as="h1" className={styles.title}>Support <span>reportingLabs</span></Heading>
          <p className={styles.lead}>
            reportingLabs is free for everyone, with no paid tier and no usage limits. If it saves your team time in triage,
            you can support the work that keeps it going: Node.js, Java and Python kept in step, new integrations, fixes and docs.
            Pick any amount, once.
          </p>

          <div className={styles.cards}>
            <PayCard title="From India" cur="₹ INR" url={RAZORPAY_URL} label="Support with Razorpay"
              text="UPI, cards, netbanking and wallets. Choose the amount on the next page."
              via="Secure checkout on Razorpay" />
            <PayCard title="From anywhere else" cur="$ USD" url={STRIPE_URL} label="Support with Stripe"
              text="Cards, Apple Pay and Google Pay. Choose the amount on the next page."
              via="Secure checkout on Stripe" />
          </div>

          <div className={styles.notes}>
            <div className={styles.note}><b>Nothing changes for you</b>Every feature stays free and MIT-licensed, whether or not you support it.</div>
            <div className={styles.note}><b>Payments stay with the processor</b>You pay on Razorpay or Stripe. This site never sees your card or bank details.</div>
            <div className={styles.note}><b>Not a tax-deductible donation</b>reportingLabs is not a registered charity. You get the payment receipt from Razorpay or Stripe.</div>
          </div>

          <div className={styles.other}>
            <Heading as="h2">Other ways to help</Heading>
            <ul>
              <li>Star the repos on GitHub: <a href="https://github.com/naveenautomationlabs/reporting-labs">Node.js</a>, <a href="https://github.com/naveenautomationlabs/reporting-labs-java">Java</a>, <a href="https://github.com/naveenautomationlabs/reporting-labs-python">Python</a>.</li>
              <li>Report a bug or ask for a feature in the issues. A report with a sample run is the most useful thing there is.</li>
              <li>Tell your team, or write about how you use it. Share a screenshot of your report.</li>
            </ul>
            <p style={{ marginTop: 18 }}><Link to="/intro">What is reportingLabs?</Link> · <Link to="/security-privacy">Security &amp; privacy</Link></p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
