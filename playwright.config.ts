import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    use: {
        headless: false, // Set to false to run tests with a visible browser
    },
};

export default config;