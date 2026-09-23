import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200/',
    video: false,
    screenshotsFolder: 'cypress/_output/screenshots',
    videosFolder: 'cypress/_output/video',
  },
});
