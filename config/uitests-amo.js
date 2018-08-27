// For use on addons-server, or with the command `amo:ui-tests` and the
// HOSTNAME  variable as `ui-tests`.
module.exports = {
  apiHost: 'http://olympia.test',
  CSP: false,
  proxyApiHost: 'http://olympia.test',
  proxyPort: 3000,
  proxyEnabled: true,
  // Setting this to false returns add-ons that are not compatible but means
  // developers can pull from a much larger dataset on the local/-dev/-stage
  // servers. Set this to true to only get compatible add-ons (this is what
  // happens in production) but get a lot fewer add-ons in search results.
  restrictSearchResultsToAppVersion: false,
  fxaConfig: 'default',
  trackingEnabled: false,
  loggingLevel: 'debug',
  enableAMInstallButton: true,
  enableNodeStatics: true,
};
