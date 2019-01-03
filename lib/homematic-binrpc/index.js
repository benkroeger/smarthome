'use strict';

// node core modules

// third-party modules
const xmlrpc = require('binrpc');

// internal modules

// Config
const thisHost = '192.168.178.22';
const ccuHost = 'homematic-ccu2';
const xmlrpcUrl = `xmlrpc_bin://${thisHost}:2031`;

const rpcClient = xmlrpc.createClient({ host: ccuHost, port: '2001' }); // CCU

/**
 * Tell the CCU that we want to receive events
 */
function subscribe() {
  console.log(' > ', 'init', [xmlrpcUrl, 'test123']);
  rpcClient.methodCall('init', [xmlrpcUrl, 'test123'], (err, res) => {
    console.log('subscribe init response', { err, res });
  });
}

/**
 * Tell the CCU that we no longer want to receive events
 */
function unsubscribe() {
  console.log(' > ', 'init', [xmlrpcUrl, '']);
  rpcClient.methodCall('init', [xmlrpcUrl, ''], (err, res) => {
    console.log('unsubscribe init response', { err, res });

    process.exit(0);
  });
  setTimeout(() => {
    console.log('force quit');
    process.exit(1);
  }, 1000);
}

process.on('SIGINT', () => {
  unsubscribe();
});

// Host running rpc server
const rpcServer = xmlrpc.createServer({ host: thisHost, port: '2031' });
rpcServer.server.on('listening', () => {
  rpcServer.on('system.listMethods', (err, params, callback) => {
    console.log(' <  system.listMethods');
    callback(null, [
      'system.listMethods',
      'system.multicall',
      'event',
      'listDevices',
      'newDevices',
      'deletedDevices',
    ]);
  });

  rpcServer.on('listDevices', (err, params, callback) => {
    console.log('> listDevices');
    callback(null, []);
  });

  rpcServer.on('NotFound', (method, params) => {
    console.log('Notfound: %s with %s', method, params);
  });

  rpcServer.on('newDevices', (err, params, callback) => {
    console.log('newDevices', params);
    callback(null, '');
  });

  rpcServer.on('deletedDevices', (err, params, callback) => {
    console.log('deletedDevices', params);
    callback(null, '');
  });
  rpcServer.on('event', (err, params, callback) => {
    console.log(' < event', JSON.stringify(params));
    callback(null, '');
  });

  rpcServer.on('system.multicall', (err, params, callback) => {
    console.log(' < system.multicall', JSON.stringify(params));
    const response = [];
    params[0].forEach(call => {
      console.log(' <', call.methodName, JSON.stringify(call.params));
      response.push('');
    });
    callback(null, '');
  });

  subscribe();
});
