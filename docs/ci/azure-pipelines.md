---
title: Azure Pipelines
sidebar_position: 4
---

# Azure Pipelines

reportingLabs runs inside your test step like any other reporter, so nothing Azure-specific is needed: run the tests, then publish the report folder as a pipeline artifact. Open the run, go to **Published** (the artifacts link on the summary), download the report and open `index.html`.

On Azure, the Node.js and Python reports show an **Azure Pipelines #1234** row in the Environment card that links back to the run, and label each run in the history with the build number.

## Playwright (Node.js)

```yaml
trigger: [main]
pool: { vmImage: ubuntu-latest }

steps:
  - task: NodeTool@0
    inputs: { versionSpec: '20.x' }
  - script: npm ci && npx playwright install --with-deps
    displayName: Install

  # History: trend, new vs known failures and "Since last run" across runs
  - task: Cache@2
    inputs:
      key: 'reporting-labs | "$(Build.SourceBranchName)" | "$(Build.BuildId)"'
      restoreKeys: 'reporting-labs | "$(Build.SourceBranchName)"'
      path: .rl-cache
  - script: cp .rl-cache/reporting-labs.history.json . 2>/dev/null || true
    displayName: Restore report history

  - script: npx playwright test
    displayName: Run tests

  - script: mkdir -p .rl-cache && cp reporting-labs.history.json .rl-cache/
    displayName: Save report history
    condition: always()
  - task: PublishPipelineArtifact@1
    displayName: Publish report
    condition: always()
    inputs:
      targetPath: reporting-labs
      artifact: test-report
```

- `condition: always()` publishes the report when tests fail, which is when you need it.
- Azure's cache works on folders, so the history file goes through `.rl-cache/`. The key changes every build (the build id) so each run saves the updated history; `restoreKeys` brings back the latest one for the branch.

## Four shards + merge

```yaml
jobs:
  - job: test
    strategy: { parallel: 4 }
    pool: { vmImage: ubuntu-latest }
    steps:
      - task: NodeTool@0
        inputs: { versionSpec: '20.x' }
      - script: npm ci && npx playwright install --with-deps
      - script: npx playwright test --shard=$(System.JobPositionInPhase)/$(System.TotalJobsInPhase)
        displayName: Run shard $(System.JobPositionInPhase)
      - task: PublishPipelineArtifact@1
        condition: always()
        inputs:
          targetPath: reporting-labs
          artifact: report-shard-$(System.JobPositionInPhase)

  - job: merge
    dependsOn: test
    condition: always()
    pool: { vmImage: ubuntu-latest }
    steps:
      - task: NodeTool@0
        inputs: { versionSpec: '20.x' }
      - script: npm ci
      - task: DownloadPipelineArtifact@2
        inputs:
          patterns: 'report-shard-*/**'
          path: all-shards
      - script: npx reporting-labs merge all-shards -o merged
        displayName: Merge shard reports
      - task: PublishPipelineArtifact@1
        inputs:
          targetPath: merged
          artifact: merged-report
```

Each shard's artifact lands in its own folder under `all-shards/`, and `reporting-labs merge` combines them into one report with one lane per shard worker. See [Sharding](../features/sharding.md).

## pytest (Python)

```yaml
steps:
  - task: UsePythonVersion@0
    inputs: { versionSpec: '3.12' }
  - script: pip install -r requirements.txt reporting-labs
    displayName: Install
  - script: pytest
    displayName: Run tests
  - task: PublishPipelineArtifact@1
    condition: always()
    inputs:
      targetPath: reporting-labs
      artifact: test-report
```

Robot Framework is the same with `robot --listener reporting_labs.RobotListener tests/` as the test step. Add the two history steps and the `Cache@2` task from the Playwright example to keep the history.

## Maven (Java)

```yaml
steps:
  - task: JavaToolInstaller@0
    inputs: { versionSpec: '17', jdkArchitectureOption: x64, jdkSourceOption: PreInstalled }
  - script: mvn -B test
    displayName: Run tests
  - task: PublishPipelineArtifact@1
    condition: always()
    inputs:
      targetPath: target/reporting-labs
      artifact: test-report
```

The Java report is written to `target/reporting-labs/` and its history to `reporting-labs.history.json` in the project folder: cache it the same way as above.

## The Tests tab too (optional)

Azure's own **Tests** tab reads JUnit XML, not HTML. To have both, keep a JUnit reporter next to reportingLabs and publish its file:

```ts
// playwright.config.ts
reporter: [['list'], ['junit', { outputFile: 'results.xml' }], ['reporting-labs']],
```

```yaml
  - task: PublishTestResults@2
    condition: always()
    inputs: { testResultsFormat: JUnit, testResultsFiles: results.xml }
```

pytest writes the same with `pytest --junitxml=results.xml`; Maven Surefire writes `target/surefire-reports/TEST-*.xml` on its own.
