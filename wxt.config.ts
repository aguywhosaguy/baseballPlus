import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
  manifest: {
    permissions: ['storage', 'alarms'],
    host_permissions: [
      "https://github.com/*",
      "https://*.githubusercontent.com/*"
    ],
    web_accessible_resources: [
      {
        matches: [
          "*://*.baseball-reference.com/*",
          "*://*.fangraphs.com/*",
          "*://baseballsavant.mlb.com/*"
        ],
        resources: [
          'data.json'
        ]
      }
    ]
  }
});
