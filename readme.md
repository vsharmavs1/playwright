# Playwright (TS binding) + Cucumber (BDD) - Parabank Test Automation

Cucumber is a popular behavior-driven development (BDD) tool that allows developers and stakeholders to collaborate on defining and testing application requirements in a human-readable format. 
TypeScript is a powerful superset of JavaScript that adds optional static typing, making it easier to catch errors before runtime. By combining these two tools, we can create more reliable and maintainable tests.

This framework is built for automating **ParaBank** (a demo banking application by Parasoft) covering end-to-end workflows including user registration, login, account overview, and other banking operations.

## Features

1. Awesome report with screenshots, videos & logs
2. Execute tests on multiple environments 
3. Parallel execution
4. Rerun only failed features
5. Retry failed tests on CI
6. Github Actions integrated with downloadable report
7. Page object model
8. Stealth plugin for anti-bot detection bypass
9. Parabank-specific test cases in Excel (65 test cases covering registration, login, navigation, and edge cases)

## Sample report
![image](https://github.com/ortoniKC/Playwright_Cucumber_TS/assets/58769833/da2d9f5a-85e7-4695-8ce2-3378b692afc4)

## Project structure

```
.
├── .github/                          # CI/CD pipeline (GitHub Actions)
│   └── workflows/
│       └── playwright.yml            # YML file to execute tests in GitHub Actions
├── config/
│   └── cucumber.js                   # Cucumber configuration (features, steps, formats, parallel execution)
├── scripts/                          # Utility scripts
├── src/
│   ├── helper/
│   │   ├── auth/                     # Storage state (auth files for session reuse)
│   │   ├── browsers/
│   │   │   └── browserManager.ts     # Browser launch logic (Chrome via playwright-extra, Firefox, WebKit)
│   │   ├── env/
│   │   │   └── .env.prod            # Environment-specific configuration
│   │   ├── report/
│   │   │   ├── init.ts              # Report initialization
│   │   │   └── report.ts            # Report generation (multiple-cucumber-html-reporter)
│   │   ├── types/                    # TypeScript type definitions for environment config
│   │   ├── util/
│   │   │   └── logger.ts            # Winston logger configuration
│   │   └── wrapper/
│   │       └── PlaywrightWrappers.ts # Reusable Playwright wrapper utilities
│   ├── hooks/
│   │   ├── hooks.ts                 # Global hooks: BeforeAll (browser setup), Before (context, tracing), After (screenshots, video, trace)
│   │   └── pageFixture.ts           # Simple way to share page objects & logger across step definitions
│   ├── pages/                        # Page Object Models
│   │   ├── loginPage.ts             # Login page elements and actions
│   │   ├── registerPage.ts          # Registration page elements and actions
│   │   └── accountsPage.ts          # Accounts Overview page elements and actions
│   └── test/
│       ├── features/
│       │   └── parabankAuth.feature  # BDD feature file for Parabank registration & login
│       └── steps/
│           └── parabankAuthSteps.ts  # Step definitions for feature file
├── test-cases/
│   └── Parabank_Test_Cases.xlsx      # 65 test cases covering registration, login, navigation, edge cases
├── test-results/                      # Test execution reports
│   ├── cucumber-report.html          # HTML report
│   ├── cucumber-report.json          # JSON report
│   ├── screenshots/                  # Screenshots (pass/fail)
│   ├── videos/                       # Test recordings
│   └── trace/                        # Playwright trace files
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
└── readme.md                          # This file
```

## Reports

1. [Multiple Cucumber Report](https://github.com/WasiqB/multiple-cucumber-html-reporter)
2. Default Cucumber report
3. [Logs](https://www.npmjs.com/package/winston)
4. Screenshots of failure
5. Test videos of failure
6. Trace of failure

## Get Started

### Prerequisites

- Node.js (v16 or higher)
- Visual Studio Code (recommended)

### Setup:

1. **Clone or download the project**
   ```
   git clone <repository-url>
   cd playwright
   ```

2. **Install dependencies**
   ```
   npm i
   ```

3. **Install Playwright browsers**
   ```
   npx playwright install
   ```

4. **Set up environment file**
   Create `.env.prod` in `src/helper/env/` with:
   ```
   BASEURL=https://parabank.parasoft.com/parabank
   ```

5. **Execute all tests**
   ```
   npm run test
   ```

6. **Run tests with specific tags**
   ```
   npm run test --TAGS="@parabankRegisterLogin"
   ```

7. **Run tests on a specific browser** (default: chrome)
   ```
   npm run test --BROWSER=firefox
   npm run test --BROWSER=webkit
   ```

8. **Debug mode**
   ```
   npm run debug
   ```

9. **Re-run failed tests only**
   ```
   npm run test:failed
   ```

## Test Cases

The project includes **65 manual test cases** in `test-cases/Parabank_Test_Cases.xlsx` covering:

| Category | Count | Description |
|---|---|---|
| Registration (Positive) | 2 | Valid registration, special characters |
| Registration (Negative - Empty Fields) | 10 | Each registration field left empty individually |
| Registration (Boundary/Edge) | 8 | Password length, invalid SSN/zip/phone formats, max field length |
| Registration (Security) | 2 | SQL Injection, XSS attempts |
| Login (Positive) | 1 | Valid credentials login |
| Login (Negative) | 2 | Invalid credentials, empty fields |
| Accounts Overview | 7 | Balance display, table structure, AJAX error/timeout, negative/zero balance |
| Navigation & UI | 23 | Top panel, header buttons, left menu, footer, Account Services links, DOM structure |
| End-to-End Workflow | 1 | Register → Logout → Login → Verify Account |
| **Total** | **65** | Comprehensive coverage of the Parabank application |

## Tutorials
1. Learn Playwright - [Playwright - TS](https://youtube.com/playlist?list=PL699Xf-_ilW7EyC6lMuU4jelKemmS6KgD)
2. BDD in detail - [TS binding](https://youtube.com/playlist?list=PL699Xf-_ilW6KgK-S1l9ynOnBGiZl2Bsk)

## Tech Stack

- **Test Framework:** Playwright 1.60 (with playwright-extra + stealth plugin for bot bypass)
- **BDD:** Cucumber (@cucumber/cucumber)
- **Language:** TypeScript
- **Reporting:** multiple-cucumber-html-reporter
- **Logging:** Winston
- **Test Data:** Excel files (xlsx) for test case management
- **CI:** GitHub Actions
- **Application Under Test:** ParaBank (https://parabank.parasoft.com)