if (Meteor.isClient) {
  QuickBooks = {};
} else {
  QuickBooks = Npm.require('node-quickbooks');

  const origConstructor = QuickBooks;
  QuickBooks = (debugFlag) => {
    const sc = ServiceConfiguration.configurations.findOne({
      service: 'quickbooks',
    });
    if (_.isUndefined(sc)) {
      throw new Meteor.Error(500,
        'Unable to find service configuration object for quickbooks. ' +
        'Is this server setup right?');
    }
    if (!Meteor.user() || !Meteor.user().services ||
      !Meteor.user().services.quickbooks) {
      throw new Meteor.Error(500,
        'Quickbooks not logged in, unable to use API');
    }
    const accessToken = Meteor.user().services.quickbooks.accessToken;
    const accessTokenSecret = Meteor.user().services.quickbooks.accessTokenSecret;
    const consumerKey = sc.consumerKey;
    const consumerSecret = sc.secret;

    // Represents which company within the users account to look at
    const companyId = Meteor.user().services.quickbooks.realmId;

    const qbo = new origConstructor(consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret,
      companyId, // in some placed realmId, in some places company.
      debugFlag); // turn debugging on
    return qbo;
  };
}
