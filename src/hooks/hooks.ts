import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
const fs = require("fs-extra");

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
});

    Before(async function ({ pickle }) {
        const scenarioName = pickle.name + pickle.id;
        context = await browser.newContext({
            baseURL: process.env.BASEURL,
            recordVideo: {
                dir: "test-results/videos",
            },
            // Realistic user-agent to bypass bot detection
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            // Extra HTTP headers to mimic real browser
            extraHTTPHeaders: {
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1',
            },
            bypassCSP: true,
            javaScriptEnabled: true,
        });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
});

After(async function ({ pickle, result }) {
    const path = `./test-results/trace/${pickle.id}.zip`;
    const isFailed = result?.status === Status.FAILED || result?.status === Status.UNDEFINED || result?.status === Status.AMBIGUOUS;

    if (isFailed) {
        // Capture and attach screenshot on failure
        const img = await fixture.page.screenshot({
            path: `./test-results/screenshots/${pickle.name}_FAILED.png`,
            type: "png",
            fullPage: true
        });
        await this.attach(img, "image/png");
        fixture.logger.error(`Test failed: ${pickle.name}. Screenshot attached to report.`);
    }

    await context.tracing.stop({ path: path });

    if (result?.status == Status.PASSED) {
        const img = await fixture.page.screenshot(
            { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
        await this.attach(img, "image/png");

        const video = fixture.page.video();
        if (video) {
            const videoPath = await video.path();
            await this.attach(
                fs.readFileSync(videoPath),
                'video/webm'
            );
        }
    }

    await fixture.page.close();
    await context.close();

    if (result?.status == Status.PASSED) {
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`;
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');
    } else if (isFailed) {
        // Attach trace file link for failed tests as well
        await this.attach(`<strong>Test Failed!</strong><br>Trace file: <a href="https://trace.playwright.dev/">Open ${path}</a>`, 'text/html');
    }
});

AfterAll(async function () {
    await browser.close();
});