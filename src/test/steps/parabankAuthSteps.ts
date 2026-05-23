import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import RegisterPage from "../../pages/registerPage";
import LoginPage from "../../pages/loginPage";
import AccountsPage from "../../pages/accountsPage";

setDefaultTimeout(60 * 1000 * 2);

let registerPage: RegisterPage;
let loginPage: LoginPage;
let accountsPage: AccountsPage;

Given('User is on the Parabank registration page', async function () {
    registerPage = new RegisterPage(fixture.page);
    await registerPage.navigateToRegisterPage();
    fixture.logger.info("Navigated to Parabank registration page");
});

When('User fills in the registration form with valid details', async function (dataTable) {
    const data = dataTable.hashes()[0];
    await registerPage.registerUser(
        data.firstName,
        data.lastName,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        data.phoneNumber,
        data.ssn,
        data.username,
        data.password,
        data.confirmPassword
    );
    fixture.logger.info("Filled registration form with user details");
});

When('User submits the registration form', async function () {
    await registerPage.submitRegistrationForm();
    fixture.logger.info("Submitted registration form");
});

Then('Registration should be successful', async function () {
    await registerPage.registerSuccessful();
    fixture.logger.info("Validated successful registration");
});

Given('User logs in with registered credentials', async function (dataTable) {
    const data = dataTable.hashes()[0];
    loginPage = new LoginPage(fixture.page);
    await loginPage.login(data.username, data.password);
    fixture.logger.info("Logged in with username: " + data.username);
});

Then('Login should be successful', async function () {
    accountsPage = new AccountsPage(fixture.page);
    const welcomeMsg = await accountsPage.getWelcomeMessage();
    expect(welcomeMsg).toContain("Welcome");
    fixture.logger.info("Login successful - Welcome message displayed");
});

Then('Account balance should be displayed on the page', async function () {
    // Verify the account table is visible
    const accountTable = fixture.page.locator("#accountTable");
    await expect(accountTable).toBeVisible();
    fixture.logger.info("Account table is visible");

    // Verify the Balance column header exists
    const balanceHeader = fixture.page.locator("#accountTable thead th").filter({ hasText: "Balance" });
    await expect(balanceHeader).toBeVisible();
    fixture.logger.info("Balance column header is visible");

    // Get and validate the account balance
    const balance = await accountsPage.getAccountBalance();
    console.log("Account Balance: " + balance);
    fixture.logger.info("Account Balance displayed: " + balance);
    
    // Validate balance format (e.g., $515.50)
    expect(balance).toMatch(/^\$\d+\.\d{2}$/);
    fixture.logger.info("Balance format validated: " + balance);

    // Verify the Total row exists
    const totalRow = fixture.page.locator("#accountTable tbody tr").last();
    await expect(totalRow).toContainText("Total");
    fixture.logger.info("Total row is visible");
    
    // Take screenshot as proof of execution
    await fixture.page.screenshot({ path: "test-results/screenshots/account-balance.png" });
    fixture.logger.info("Screenshot captured: account-balance.png");
});

Given('user logout after successful registration', async function () {
    await registerPage.userLogout();
    fixture.logger.info("User logged out after successful registration");
});