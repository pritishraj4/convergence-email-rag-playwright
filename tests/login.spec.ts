import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InboxPage } from '../pages/InboxPage';

// Use empty storage state for this file
test.use({ storageState: { cookies: [], origins: [] } });

test("should login successfully with Azure AD", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to the application
    await page.goto("https://convergence.qa.mercola.com/");

    // Perform Login
    await loginPage.login();

    const inboxPage = new InboxPage(page);
    await expect(inboxPage.composeButton).toBeVisible();
});