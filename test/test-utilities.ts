import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const resourcesDir = path.join(__dirname, '..', 'resources');
if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir);
}

// Extend base test for shared logic
export const test = base.extend({
    // You can customize fixtures here if needed.
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