import { errors } from '../errors';
import { exists } from '../utils/fs/exists';
import { MiddlewareDefinition } from './MiddlewareDefinition';
import { validateMiddlewareDefinition } from '../validators/validateMiddlewareDefinition';

const getDefaultMiddleware = function (): MiddlewareDefinition {
  return {
    command: []
  };
};
const ensureDefaults = function (middlewareDefinition: MiddlewareDefinition): MiddlewareDefinition {
  return {
    ...getDefaultMiddleware(),
    ...middlewareDefinition
  };
};

const getMiddlewareDefinition = async function ({ middlewareDirectory }: {
  middlewareDirectory: string;
}): Promise<MiddlewareDefinition> {
  if (!await exists({ path: middlewareDirectory })) {
    return getDefaultMiddleware();
  }

  let rawMiddleware;

  try {
    rawMiddleware = (await import(middlewareDirectory)).default;
  } catch (ex) {
    if (ex instanceof SyntaxError) {
      throw new errors.ApplicationMalformed(`Syntax error in '<app>/build/middleware'.`, { cause: ex });
    }

    // But throw an error if the entry is a directory without importable content.
    throw new errors.FileNotFound(`No importable middleware in '<app>/build/middleware' found.`);
  }

  try {
    validateMiddlewareDefinition({
      middlewareDefinition: rawMiddleware
    });
  } catch (ex) {
    throw new errors.MiddlewareDefinitionMalformed(`Middleware definition in '<app>/build/middleware' is malformed: ${ex.message}`);
  }

  return ensureDefaults(rawMiddleware);
};

export { getMiddlewareDefinition, getDefaultMiddleware };
