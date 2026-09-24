---
title: GitLab CI
sidebar_position: 3
---

# GitLab CI

```yaml
image: mcr.microsoft.com/playwright:v1.63.0-jammy

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/
    - reporting-labs.history.json

e2e:
  script:
    - npm ci
    - npx playwright test
  after_script:
    - echo "Report at $CI_JOB_URL/artifacts/browse/reporting-labs"
  artifacts:
    when: always
    expire_in: 30 days
    paths:
      - reporting-labs/
```

Native Slack integration in Project Settings posts pipeline results with no code at all. For a richer message, add a `notify` job with `curl` to your webhook.
