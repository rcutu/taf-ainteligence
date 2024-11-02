import { test, expect } from '@playwright/test';

let browser, context, sharedPage;

test.beforeAll(async ({ playwright }) => {
    browser = await playwright.chromium.launch({ headless: false });
    context = await browser.newContext();
    sharedPage = await context.newPage();
    await sharedPage.goto('http://localhost:5173/');

    // Verify that the title is present.
    await expect(sharedPage.locator('h1.text-2xl.font-bold')).toHaveText('Test Suite Intelligence');
});

test.afterAll(async () => {
    await browser.close();
});

test('should check the "Get JIRA TestCases" button produces 5 divs', async () => {
    const getJiraButton = sharedPage.locator('button:has-text("Get JIRA TestCases")');
    await getJiraButton.click();

    // Wait for the divs to appear
    await expect(sharedPage.locator('//div/div[contains(@class, "flex items-center gap-2")]')).toHaveCount(5);
});

test('should check the "Get Latest Commits" button is present', async () => {
    const latestCommitsButton = sharedPage.locator('button:has-text("Get Latest Commits")');

    // Check if the button is present.
    await expect(latestCommitsButton).toBeVisible();
});

test('should check the "Filter TestCases" button is present', async () => {
    const filterTestCasesButton = sharedPage.locator('button:has-text("Filter TestCases")');

    // Check if the button is present.
    await expect(filterTestCasesButton).toBeVisible();
});