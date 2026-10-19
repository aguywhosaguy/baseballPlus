import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
  manifest: {
    permissions: ['storage', 'alarms'],
    host_permissions: [
      "https://github.com/*",
      "https://*.githubusercontent.com/*"
    ]
  }
});
