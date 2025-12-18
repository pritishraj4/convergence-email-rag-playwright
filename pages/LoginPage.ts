import { Page, Locator } from '@playwright/test';
import * as OTPAuth from "otpauth";

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly otpInput: Locator;
    readonly verifyButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('//input[@id="email"]');
        this.passwordInput = page.locator('//input[@id="password"]');
        this.loginButton = page.locator('//button[@type="submit"]');
        this.otpInput = page.locator('//input[@data-slot="input-otp"]');
        this.verifyButton = page.locator('//button[@type="submit"]');
    }

    async login() {
        const email = process.env.EMAIL;
        const password = process.env.PASSWORD;

        if (!email || !password) {
            throw new Error('Email and Password are required');
        }

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        try {
            await this.otpInput.waitFor({ state: 'visible', timeout: 5000 });
            console.log('MFA detected. Please enter OTP manually if not automated.');

            let totp = new OTPAuth.TOTP({
                issuer: 'Mercola',
                label: 'Pritish',
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: process.env.MFA_SECRET,
            });
            let code = totp.generate();
            await this.otpInput.fill(code);
            await this.verifyButton.click();

        } catch (e) {
            console.log('No MFA input detected requiring code entry, or it was skipped.');
        }
    }
}
