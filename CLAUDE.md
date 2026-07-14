# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test               # lint + unit tests (runs before every commit via Husky)
npm run test:unit      # unit tests only
npm run test:int       # integration tests (invokes handlers against AWS; requires deploy)
npm run test:e2e       # e2e tests (hits live API; requires deploy)
npm run deploy         # deploy to AWS via Serverless Framework
npm run lint           # eslint check
npm run lint:fix       # eslint auto-fix
npm run prettier       # format all files with prettier
```

To run a single test file:

```bash
npx jest path/to/test.file --config jest.config.js
```

## Architecture

This is a **Serverless Framework** project targeting AWS Lambda (Node.js 24.x). Handlers are bundled individually with **esbuild** (minified, no sourcemaps) defined in `serverless.yml`.

**Handler pattern:** Each Lambda handler is wrapped with `@middy/core` middleware and uses `@aws-lambda-powertools/logger` for structured logging. Example in `src/helloWorld.js`.

**Test layers:**

- `*.unit.test.js` — pure unit tests, no AWS, use `jest.config.js`
- `*.int.test.js` — invoke handlers directly (ESM imports); require AWS credentials but not a live HTTP endpoint; use `jest.config.int.js` which maps `@middy/*` modules to avoid ESM transform issues
- `*.e2e.test.js` — hit the deployed API over HTTP via `axios`; `jest.config.e2e.js` reads the live stack URL from CloudFormation outputs at setup time

**CI pipeline** (`.github/workflows/`): On push to `master`, the workflow deploys then runs int and e2e tests against the live stack. On PRs, only `npm test` (lint + unit) runs — and only for dependabot PRs.

**ESLint config** (`eslint.config.mjs`): Flat config (ESLint v10). Key rules: `max-params: warn 1`, `no-param-reassign: error`. The `no-only-tests` plugin prevents accidentally committing `test.only`.

## Known constraints

- The Serverless Framework license key is pulled from AWS Secrets Manager via SSM (`/aws/reference/secretsmanager/serverless-framework-access-key`).
