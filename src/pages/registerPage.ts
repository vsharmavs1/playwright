import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class RegisterPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        firstName: "input[name='customer.firstName']",
        lastName: "input[name='customer.lastName']",
        address: "input[name='customer.address.street']",
        city: "input[name='customer.address.city']",
        state: "input[name='customer.address.state']",
        zipCode: "input[name='customer.address.zipCode']",
        phoneNumber: "input[name='customer.phoneNumber']",
        ssn: "input[name='customer.ssn']",
        username: "input[name='customer.username']",
        password: "input[name='customer.password']",
        confirmPassword: "input[name='repeatedPassword']",
        registerBtn: "input[value='Register']",
        logoutBtn: "//a[contains(text(),'Log Out')]",
    };

    async navigateToRegisterPage() {
        await this.page.goto("register.xhtml");
        await this.page.locator("//a[contains(text(),'Register')]").filter({ hasText: "Register" }).waitFor({ state: "visible" });
        await this.page.locator("//a[contains(text(),'Register')]").filter({ hasText: "Register" }).click();
    }

    async registerUser(firstName: string, lastName: string, address: string, city: string, 
                       state: string, zipCode: string, phoneNumber: string, ssn: string,
                       username: string, password: string, confirmPassword: string) {
        await this.page.fill(this.Elements.firstName, firstName);
        await this.page.fill(this.Elements.lastName, lastName);
        await this.page.fill(this.Elements.address, address);
        await this.page.fill(this.Elements.city, city);
        await this.page.fill(this.Elements.state, state);
        await this.page.fill(this.Elements.zipCode, zipCode);
        await this.page.fill(this.Elements.phoneNumber, phoneNumber);
        await this.page.fill(this.Elements.ssn, ssn);
        await this.page.fill(this.Elements.username, username);
        await this.page.fill(this.Elements.password, password);
        await this.page.fill(this.Elements.confirmPassword, confirmPassword);
    }

    async registerSuccessful(){
        await this.page.locator("//h1[contains(text(),'Welcome')]").waitFor({ state: "visible" });
        expect(await this.page.locator("//p[contains(text(),'Your account was created successfully. You are now logged in.')]")).toBeVisible();
    }

    async submitRegistrationForm(){
        await this.base.waitAndClick(this.Elements.registerBtn);
    }

    async userLogout(){
        await this.base.waitAndClick(this.Elements.logoutBtn);
    }
}