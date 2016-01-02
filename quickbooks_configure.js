Template.configureLoginServiceDialogForQuickbooks.helpers({
  siteUrl() {
    return Meteor.absoluteUrl();
  },
});

Template.configureLoginServiceDialogForQuickbooks.fields = () => {
  return [{
    property: 'consumerKey',
    label: 'Consumer Key',
  }, {
    property: 'secret',
    label: 'Consumer Secret',
  }];
};
