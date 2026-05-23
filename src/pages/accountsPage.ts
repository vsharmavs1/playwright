import { Page } from "@playwright/test";

export default class AccountsPage {
    constructor(private page: Page) {}

    private Elements = {
        // Account balance is typically displayed in a table
        accountBalance: "//td[contains(text(), '$')]"
    };

    async getAccountBalance(): Promise<string> {
        // Wait for the page to load and get the balance
        await this.page.waitForLoadState("networkidle");
        const balanceElement = this.page.locator(this.Elements.accountBalance).first();
        await balanceElement.waitFor({ state: "visible" });
        const balance = await balanceElement.textContent();
        return balance || "";
    }

    async getWelcomeMessage(): Promise<string> {
        // Get the welcome message that confirms login
        const welcomeElement = this.page.locator("//b[contains(text(),'Welcome')]").first();
        await welcomeElement.waitFor({ state: "visible" });
        return await welcomeElement.textContent() || "";
    }
}