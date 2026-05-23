import { Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class LoginPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        username: "input[name='username']",
        password: "input[name='password']",
        loginBtn: "input[value='Login']"
    };

    async navigateToLoginPage() {
        await this.page.goto("index.htm?ConnType=JDBC");
    }

    async enterUsername(username: string) {
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