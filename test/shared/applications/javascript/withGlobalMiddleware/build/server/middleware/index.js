'use strict';

const NS_PER_SEC = 1e9;

module.exports = {
  command: [
    async function timeCommand (_1, _2, { logger }, next) {
      const time = process.hrtime();

      /* eslint-disable callback-return */
      await next();
      /* eslint-enable callback-return */

      const [ seconds, nano ] = process.hrtime(time);
      const duration = (seconds * NS_PER_SEC) + nano;

      logger.info(`Command took ${duration} nanoseconds`);
    }
  ]
};
