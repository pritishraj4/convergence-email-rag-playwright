import test, { expect } from "@playwright/test";
import { InboxPage } from "../pages/InboxPage";

import { ChatPage } from "../pages/ChatPage";

test("should search for a topic", async ({ page }) => {
    const inboxPage = new InboxPage(page);
    const chatPage = new ChatPage(page);

    await page.goto('https://convergence.qa.mercola.com/');

    await expect(inboxPage.searchInput).toBeVisible();
    await inboxPage.aiSearch("What is the capital of France?");
    await expect(page).toHaveURL("https://convergence.qa.mercola.com/chat")
    await expect(chatPage.searchSummary).toBeVisible();
});
