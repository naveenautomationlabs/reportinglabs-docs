import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './support.module.css';

export default function ThankYou(): ReactNode {
  return (
    <Layout title="Thank you" description="Thank you for supporting reportingLabs.">
      <main className={styles.page}>
        <div className={`container ${styles.thanks}`}>
          <div className={styles.heart} aria-hidden="true">♥</div>
          <Heading as="h1" className={styles.title}>Thank you for supporting <span>reportingLabs</span></Heading>
          <p className={styles.lead} style={{ margin: '0 auto' }}>
            Your support goes straight into keeping reportingLabs free, maintained and growing across Node.js, Java and Python.
            The receipt for your payment comes by email from Razorpay or Stripe.
          </p>
          <div className={styles.links}>
            <Link className="button button--primary button--lg" to="/">Back to reportingLabs</Link>
            <a className="button button--secondary button--lg" href="https://github.com/naveenautomationlabs/reporting-labs">Star on GitHub</a>
          </div>
        </div>
      </main>
    </Layout>
  );
}
