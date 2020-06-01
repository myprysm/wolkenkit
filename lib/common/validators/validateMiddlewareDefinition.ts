import { errors } from '../errors';
import { isArray, isFunction } from 'lodash';

const validateMiddlewareDefinition = function ({ middlewareDefinition }: {
  middlewareDefinition: any;
}): void {
  if (middlewareDefinition.command) {
    if (!isArray(middlewareDefinition.command)) {
      throw new errors.MiddlewareDefinitionMalformed(`Property 'command' is not an array.`);
    }

    if (!middlewareDefinition.command.every((middleware: any): boolean => isFunction(middleware))) {
      throw new errors.MiddlewareDefinitionMalformed(`Property 'command' should contain only functions.`);
    }
  }
};

export { validateMiddlewareDefinition };
