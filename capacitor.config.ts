import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.buylogint.buylog',
  appName: 'Buylog',
  webDir: 'public',

  server: {
    url: 'https://buylogint.com',
    cleartext: false,
    allowNavigation: [
      "buylogint.com",
      "*.buylogint.com"
    ]
  }
};

export default config;