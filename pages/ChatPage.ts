import { Page, Locator } from "@playwright/test";

export class ChatPage {
    readonly page: Page;
    readonly searchSummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchSummary = page.locator('//p[.="AI Search Result"]/../../../div[2]');
    }
}
