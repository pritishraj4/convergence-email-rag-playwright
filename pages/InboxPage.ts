//header//button[@id='radix-«rc»']

import { Page, Locator } from '@playwright/test';

export class InboxPage {
    readonly page: Page;
    readonly composeButton: Locator;
    readonly profileButton: Locator;
    readonly logoutButton: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.composeButton = page.locator('//button[.="Compose"]');
        this.profileButton = page.locator('//header//button[@id="radix-«rc»"]');
        this.logoutButton = page.locator('//button[contains(.,"Logout")]');
        this.searchInput = page.locator('//input[@placeholder="Search anything here"]');
    }

    async openProfile() {
        await this.profileButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async aiSearch(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }
}