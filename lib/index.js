'use strict';

const fritz = require('fritzapi');

const { FRITZ_PASSWORD, FRITZ_USERNAME = 'smarthome' } = process.env;

const options = {};

fritz
  .getSessionID(FRITZ_USERNAME, FRITZ_PASSWORD, options)
  .then(sid =>
    // note that the options/url need be carried through every single api call
    fritz.getSwitchList(sid, options).then(ains =>
      Promise.all(
        ains.map(ain =>
          Promise.all(
            ['getSwitchName', 'getSwitchState'].map(method =>
              fritz[method](sid, ain, options),
            ),
          ).then(([name, oldState]) => {
            const toggleMethod = oldState ? 'setSwitchOff' : 'setSwitchOn';
            return fritz[toggleMethod](sid, ain, options).then(newState => ({
              ain,
              name,
              oldState,
              newState,
            }));
          }),
        ),
      ),
    ),
  )
  .then(console.log, console.error);
