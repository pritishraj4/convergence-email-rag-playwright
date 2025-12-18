
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InboxPage } from '../pages/InboxPage';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inboxPage = new InboxPage(page);

    await page.goto('https://convergence.qa.mercola.com/');
    await loginPage.login();

    // Wait for login to complete (e.g. valid verifying element)
    await expect(inboxPage.searchInput).toBeVisible();

    // Save storage state
    await page.context().storageState({ path: authFile });
});
