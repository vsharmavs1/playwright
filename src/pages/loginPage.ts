import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class LoginPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        h2customerLogin: "//h2[contains(text(),'Customer Login')]",
        username: "input[name='username']",
        password: "input[name='password']",
        loginBtn: "input[value='Log In']"
    };

    async navigateToLoginPage() {
        await this.page.goto("index.htm?ConnType=JDBC");
    }

    async enterUsername(username: string) {
        expect(await this.page.locator(this.Elements.h2customerLogin)).toBeVisible();
        await this.page.fill(this.Elements.username, username);
    }

    async enterPassword(password: string) {
        await this.page.fill(this.Elements.password, password);
    }

    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn);
    }

    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}