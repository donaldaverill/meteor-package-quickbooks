// Request quickbooks credentials for the user
// @param options {optional}  XXX support options.requestPermissions
// @param credentialRequestCompleteCallback {Function} Callback
// function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
QuickBooks.requestCredential = (optionsParam, credentialRequestCompleteCallbackParam) => {
  // support both (options, callback) and (callback).
  let options = optionsParam;
  let credentialRequestCompleteCallback = credentialRequestCompleteCallbackParam;
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({
    service: 'quickbooks',
  });

  if (!config) {
    if (credentialRequestCompleteCallback) {
      credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError(
        'Service not configured'));
    }
    throw new Meteor.Error('quickbooks-service-configuration',
      'There\'s no ServiceConfiguration for quickbooks.');
  }

  const credentialToken = Random.id();
  // We need to keep credentialToken across the next two 'steps' so we're adding
  // a credentialToken parameter to the url and
  // the callback url that we'll be returned
  // to by oauth provider

  // // url back to app, enters 'step 2' as described in
  // // packages/accounts-oauth1-helper/oauth1_server.js
  const loginStyle = OAuth._loginStyle('quickbooks', config, options);

  const callbackUrl = Meteor.absoluteUrl(
    '_oauth/quickbooks/?requestTokenAndRedirect=true&state=' +
    OAuth._stateParam(loginStyle, credentialToken));


  // var url = 'https://appcenter.intuit.com/Connect/SessionStart?grantUrl=' +
  //   encodeURIComponent(callbackUrl) + '&state=' + credentialToken;
  // Oauth.initiateLogin(credentialToken, url,
  //   credentialRequestCompleteCallback);

  const loginUrl =
    'https://appcenter.intuit.com/Connect/SessionStart?grantUrl=' +
    encodeURIComponent(callbackUrl) +
    '&state=' +
    OAuth._stateParam(loginStyle, credentialToken);
  // OAuth.initiateLogin(credentialToken, url, credentialRequestCompleteCallback);

  OAuth.launchLogin({
    loginService: 'quickbooks',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {
      width: 600,
      height: 750,
    },
  });
};
