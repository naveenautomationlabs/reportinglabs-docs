---
title: Jenkins
sidebar_position: 2
---

# Jenkins

Declarative pipeline that installs Playwright, runs 4 shards in parallel via a matrix stage, and merges into one report.

```groovy
pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run shards in parallel') {
      matrix {
        axes { axis { name 'SHARD'; values '1', '2', '3', '4' } }
        stages {
          stage('Test') {
            steps {
              sh "npx playwright test --shard=${SHARD}/4"
              stash name: "report-shard-${SHARD}", includes: 'reporting-labs/**'
            }
          }
        }
      }
    }

    stage('Merge into one report') {
      steps {
        sh 'rm -rf all-shards merged && mkdir -p all-shards'
        script {
          ['1', '2', '3', '4'].each { s ->
            dir("all-shards/shard-${s}") { unstash "report-shard-${s}" }
          }
        }
        sh '''
          for d in all-shards/shard-*; do
            mv "$d/reporting-labs/"* "$d/"
            rmdir "$d/reporting-labs"
          done
        '''
        sh 'npx reporting-labs merge all-shards -o merged'
        archiveArtifacts artifacts: 'merged/**', allowEmptyArchive: false
      }
    }
  }

  post {
    failure {
      slackSend(
        color: 'danger',
        channel: '#qa-reports',
        message: "Playwright FAILED on ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}artifact/merged/index.html"
      )
    }
  }
}
```

**HTML Publisher plugin note:** Jenkins blocks inline JavaScript by default, so the merged report shows up blank inside the HTML Publisher (Playwright's own HTML report has the same problem). Download the archived artifact and open it locally, or ask an admin to relax the CSP in the script console:

```
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
```
