import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Ensure the resources directory exists
const resourcesDir = path.join(__dirname, '..', 'resources');
if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir);
}

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Verify that the title is present
    await expect(page.locator('h1.text-2xl.font-bold')).toHaveText('Test Suite Intelligence');
});

test('should check the "Get JIRA TestCases" button produces 5 divs', async ({ page }) => {
    const getJiraButton = page.locator('button:has-text("Get JIRA TestCases")');
    await getJiraButton.click();
    // Wait for the divs to appear
    await expect(page.locator('.flex.items-center.gap-2')).toHaveCount(5);
});

test('should check the "Get Latest Commits" button is present', async ({ page }) => {
    const latestCommitsButton = page.locator('button:has-text("Get Latest Commmits")');
    // Check if the button is present
    await expect(latestCommitsButton).toBeVisible();
});

test('should check the "Filter TestCases" button is present', async ({ page }) => {
    const filterTestCasesButton = page.locator('button:has-text("Filter TestCases")');
    // Check if the button is present
    await expect(filterTestCasesButton).toBeVisible();
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
        const testNameSlug = testInfo.title.replace(/\s+/g, '-').toLowerCase();

        if (testInfo.error) {
            const stackTrace = testInfo.error.stack || '';
            await saveStackTrace(stackTrace, testNameSlug);
        }

        try {
            const domContent = await page.content();
            await saveDOMState(domContent, testNameSlug);
        } catch (error) {
            console.error('Error while capturing DOM content:', error);
        }
    }
});

async function saveStackTrace(stack: string, testNameSlug: string) {
    const filePath = path.join(resourcesDir, `${testNameSlug}-stacktrace.txt`);
    await fs.promises.writeFile(filePath, stack, 'utf-8');
    console.log(`Stack trace saved to ${filePath}`);
}

async function saveDOMState(domContent: string, testNameSlug: string) {
    const filePath = path.join(resourcesDir, `${testNameSlug}-dom.html`);
    await fs.promises.writeFile(filePath, domContent, 'utf-8');
    console.log(`DOM state saved to ${filePath}`);
}