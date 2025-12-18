
import { google } from 'googleapis';
import path from 'path';

export class GoogleSheetManager {
    private auth;
    private sheets;
    private spreadsheetId: string;

    constructor(spreadsheetId: string) {
        this.spreadsheetId = spreadsheetId;
        this.auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'service_account.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    async readColumn(range: string): Promise<string[]> {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range,
        });
        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];
        return rows.map((row) => row[0]); // Assuming single column
    }

    async writeToCell(range: string, value: string) {
        await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[value]],
            },
        });
    }
}
