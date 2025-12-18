import { Page, Locator, expect } from "@playwright/test";

export class ChatPage {
    readonly page: Page;
    readonly searchSummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchSummary = page.locator('//p[.="AI Search Result"]/../../../div[2]');
    }

    async getSearchResult() {
        await this.searchSummary.waitFor({ state: 'visible' });
        // Wait for the loading text to disappear
        await expect(this.searchSummary).not.toContainText("Hold on, we are finding the best matches", { timeout: 30000 });

        // Return the actual result text
        return await this.searchSummary.innerText();
    }
}
