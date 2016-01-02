if (Meteor.isServer) {
  Tinytest.add('QuickBooks - defined on server', (test) => {
    test.notEqual(QuickBooks, undefined, 'Expected ' +
      'Quickbooks to be defined on the server.');
  });
}

if (Meteor.isClient) {
  Tinytest.add('QuickBooks - defined on client', (test) => {
    test.notEqual(QuickBooks, undefined, 'Expected ' +
      'QuickBooks to be defined on the client.');
  });
}
