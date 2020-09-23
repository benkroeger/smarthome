'use strict';

// node core modules

// third-party modules
const phin = require('phin');

// internal modules

// phin({
//   url: 'http://homematic-ccu2/ise/checkrega.cgi',
//   method: 'GET',
// }).then((res) => {
//   const { statusCode, body, headers } = res;

//   console.log({ headers, statusCode, body: body.toString() });
// });

// const command = 'Write(system.Date("%F %X").ToTime().ToInteger());';
// const command = 'string x = "Hello";\nWriteLine(x # " World!");';
const command = Buffer.from(
  'Write(system.Date("%F %X").ToTime().ToInteger());',
);
// const command = Buffer.from('string x = "Hello";\nWriteLine(x # " World!");');
const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  'content-length': Buffer.byteLength(command),
};

// should encoding be 'iso-8859-1' (use iconv-lite)?
phin({
  url: 'http://homematic-ccu2:8181/rega.exe',
  method: 'POST',
  headers,
  data: command,
}).then((res) => {
  const { headers: resHeaders, statusCode, body } = res;
  console.log({ statusCode, resHeaders, body: body.toString('utf8') });
});
