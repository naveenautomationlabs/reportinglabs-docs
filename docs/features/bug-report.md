---
title: Bug report button
sidebar_position: 4
---

# Bug report button

Every failed test has a **Bug report** button. Click it and you get a ready-to-paste ticket in **Markdown**, **Jira wiki syntax** or **plain text** — pick your format from the dialog.

The generated ticket includes:

- Title with priority / owner / feature
- Test file, spec name, run label
- Environment (branch, commit, browser, OS, CI job)
- Test data attached to the test
- Steps to reproduce, taken from the test's own steps, the failing one marked
- Expected vs actual (when the failure is an assertion)
- The full error message and stack
- API calls captured during the test (if any)
- Attachment file names

Paste it into Jira, GitHub Issues, Azure DevOps or an email. No template configuration on your side.
