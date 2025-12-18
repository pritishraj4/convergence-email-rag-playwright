
import test, { expect } from "@playwright/test";
import { InboxPage } from "../pages/InboxPage";
import { ChatPage } from "../pages/ChatPage";
import { GoogleSheetManager } from "../utils/GoogleSheetManager";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1F-XnLq8x8gXnLq8x8gXnLq8x8gXnLq8x8g';
const READ_RANGE = 'Sheet1!A2:A';
const WRITE_COLUMN = 'B';

test("process queries from Google Sheet", async ({ page }) => {
    const sheetManager = new GoogleSheetManager(SPREADSHEET_ID);
    const queries = await sheetManager.readColumn(READ_RANGE);

    const inboxPage = new InboxPage(page);
    const chatPage = new ChatPage(page);

    await page.goto('https://convergence.qa.mercola.com/');
    await expect(inboxPage.searchInput).toBeVisible();

    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        if (!query) continue;
        const rowNumber = i + 2;

        try {
            await inboxPage.aiSearch(query);

            await expect(page).toHaveURL("https://convergence.qa.mercola.com/chat");

            const resultText = await chatPage.getSearchResult();

            await sheetManager.writeToCell(`Sheet1!${WRITE_COLUMN}${rowNumber}`, resultText);

            await page.screenshot({ path: `screenshots/query_${rowNumber}.png` });

        } catch (error) {
            console.error(`Error processing query at row ${rowNumber}:`, error);

            const errorMessage = error instanceof Error ? error.message : String(error);
            // Write a simplified error message to the sheet
            await sheetManager.writeToCell(`Sheet1!${WRITE_COLUMN}${rowNumber}`, `ERROR: ${errorMessage.split('\n')[0]}`);

            await page.screenshot({ path: `screenshots/error_query_${rowNumber}.png` });
        }

        // Navigate back or reset for next query
        try {
            await page.goto('https://convergence.qa.mercola.com/');
            await expect(inboxPage.searchInput).toBeVisible();
        } catch (resetError) {
            console.error("Critical: Failed to reset application state. Aborting remaining queries.", resetError);
            break;
        }
    }
});
