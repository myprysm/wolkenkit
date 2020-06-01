const NS_PER_SEC = 1e9;

const timeCommand = function () {
  return async function (_, { name }, { logger }, next) {
    const time = process.hrtime();

    try {
      return await next();
    } finally {
      const [seconds, nanos] = process.hrtime(time);
      const duration = (seconds * NS_PER_SEC) + nanos;

      logger.info(`Command ${name} took ${duration} nanoseconds.`)
    }
  }
}

module.exports = { timeCommand };
