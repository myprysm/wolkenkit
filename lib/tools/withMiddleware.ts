import { ApplicationDefinition } from '../common/application/ApplicationDefinition';
import { ApplicationEnhancer } from './ApplicationEnhancer';
import { cloneDeep } from 'lodash';
import { MiddlewareDefinition } from '../common/application/MiddlewareDefinition';

const withMiddleware = function (middlewareDefinition: MiddlewareDefinition): ApplicationEnhancer {
  return function (applicationDefinition): ApplicationDefinition {
    const clonedApplicationDefinition = cloneDeep(applicationDefinition);

    for (const [ contextName, contextDefinition ] of Object.entries(clonedApplicationDefinition.domain)) {
      for (const [ aggregateName, aggregateDefinition ] of Object.entries(contextDefinition)) {
        for (const commandName of Object.keys(aggregateDefinition.commandHandlers)) {
          clonedApplicationDefinition.domain[contextName][aggregateName].commandHandlers[commandName].middleware = [
            ...middlewareDefinition.command,
            ...clonedApplicationDefinition.domain[contextName][aggregateName].commandHandlers[commandName].middleware ?? []
          ];
        }
      }
    }

    return clonedApplicationDefinition;
  };
};

export { withMiddleware };
