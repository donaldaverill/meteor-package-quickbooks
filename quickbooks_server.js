const urls = {
  requestToken: 'https://oauth.intuit.com/oauth/v1/get_request_token',
  authorize: 'https://appcenter.intuit.com/Account/DataSharing/Authorize',
  accessToken: 'https://oauth.intuit.com/oauth/v1/get_access_token',
  authenticate: 'https://appcenter.intuit.com/Connect/Begin',
};

const capitaliseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

QuickBooks.whitelistedFields = [
  'firstName',
  'lastName',
  'emailAddress',
  'screenName',
  'isVerified',
];

OAuth.registerService(
  'quickbooks', 1, urls, (oauthBinding, options) => {
    const Future = Npm.require('fibers/future');
    const future = new Future();
    const xml2js = Npm.require('xml2js');
    const response = oauthBinding.get(
      'https://appcenter.intuit.com/api/v1/user/current');
    xml2js.parseString(response.content, function(err, result) {
      future.return(result);
    });
    const parsedResponse = future.wait();

    if (parsedResponse.UserResponse.ErrorMessage) {
      throw new Meteor.Error(500, 'Failed to get use info from quickbooks: ' +
        parsedResponse.UserResponse.ErrorMessage);
    }

    const identity = {
      id: parsedResponse.UserResponse.User[0].$.Id,
    };
    QuickBooks.whitelistedFields.forEach(function(field) {
      const xmlField = capitaliseFirstLetter(field);
      identity[field] = parsedResponse.UserResponse.User[0][xmlField][0];
    });

    const serviceData = _.extend({
      name: 'quickbooks',
      accessToken: OAuth.sealSecret(oauthBinding.accessToken),
      accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret),
      realmId: options && options.query && options.query.realmId,
    }, identity);

    serviceData.verified_email = serviceData.isVerified;

    return {
      serviceData,
      options: {
        profile: {
          name: identity.screenName,
        },
      },
    };
  });

QuickBooks.retrieveCredential = (credentialToken) => {
  return OAuth.retrieveCredential(credentialToken);
};
