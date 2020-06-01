import { CommandData, CommandMiddleware, State } from 'wolkenkit';

const NS_PER_SEC = 1e9;

const timeCommand = function (): CommandMiddleware<State, CommandData> {
  return async function (_, { name }, { logger }, next): Promise<void> {
    const time = process.hrtime();

    try {
      return await next();
    } finally {
      const [ seconds, nanos ] = process.hrtime(time);
      const duration = (seconds * NS_PER_SEC) + nanos;

      logger.info(`Command ${name} took ${duration} nanoseconds.`)
    }
  }
}

export { timeCommand };
