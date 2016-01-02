Package.describe({
  summary: 'An implementation of the Quickbooks oAuth flow.',
  version: '2.0.0_1',
  name: 'fourquet:quickbooks',
  git: 'https://github.com/fourquet/quickbooks.git',
  documentation: 'README.md',
  license: 'LICENSE',
});

Npm.depends({
  'node-quickbooks': '2.0.0',
  'xml2js': '0.4.15',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('ecmascript@0.1.6', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');
  api.use('oauth1', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('random', 'client');
  api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles(
    [
      'quickbooks_configure.html',
      'quickbooks_configure.js',
    ],
    'client');

  api.addFiles('quickbooks_common.js', [
    'client',
    'server',
  ]);
  api.addFiles('quickbooks_server.js', 'server');
  api.addFiles('quickbooks_client.js', 'client');
  api.export('QuickBooks');
});

Package.onTest(function(api) {
  api.use('ecmascript@0.1.6', [
    'client',
    'server'
  ]);
  api.use('tinytest', [
    'client',
    'server',
  ]);
  api.use('fourquet:quickbooks', [
    'client',
    'server',
  ]);
  api.addFiles('quickbooks_tests.js', [
    'client',
    'server',
  ]);
});
