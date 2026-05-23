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
        recordVideo: {
            dir: "test-results/videos",
        },
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
    if (result?.status == Status.PASSED) {
        const img = await fixture.page.screenshot(
            { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
        const video = fixture.page.video();
        if (video) {
            const videoPath = await video.path();
            await this.attach(
                img, "image/png"
            );
            await this.attach(
                fs.readFileSync(videoPath),
                'video/webm'
            );
        }
    }
    await context.tracing.stop({ path: path });
    await fixture.page.close();
    await context.close();
    if (result?.status == Status.PASSED) {
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`;
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');
    }
});

AfterAll(async function () {
    await browser.close();
});