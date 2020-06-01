import { assert } from 'assertthat';
import { CustomError } from 'defekt';
import { validateMiddlewareDefinition } from '../../../../lib/common/validators/validateMiddlewareDefinition';

suite('validateMiddlewareDefinition', (): void => {
  const middlewareDefinition = {
    command: [
      function (): void {
        // Intentionally left blank.
      }
    ]
  };

  test('does not throw if everything is fine.', async (): Promise<void> => {
    assert.that((): void => {
      validateMiddlewareDefinition({ middlewareDefinition });
    }).is.not.throwing();
  });

  test('does not throw if command middleware is not provided.', async (): Promise<void> => {
    assert.that((): void => {
      validateMiddlewareDefinition({ middlewareDefinition: {
        ...middlewareDefinition,
        command: undefined
      }});
    }).is.not.throwing();
  });

  test('throws an error if command is not an array.', async (): Promise<void> => {
    assert.that((): void => {
      validateMiddlewareDefinition({
        middlewareDefinition: {
          command: {}
        }
      });
    }).is.throwing(
      (ex): boolean =>
        (ex as CustomError).code === 'EMIDDLEWAREDEFINITIONMALFORMED' &&
        ex.message === `Property 'command' is not an array.`
    );
  });

  test('throws an error if a command middleware is not a function.', async (): Promise<void> => {
    assert.that((): void => {
      validateMiddlewareDefinition({
        middlewareDefinition: {
          command: [ 1 ]
        }
      });
    }).is.throwing(
      (ex): boolean =>
        (ex as CustomError).code === 'EMIDDLEWAREDEFINITIONMALFORMED' &&
        ex.message === `Property 'command' should contain only functions.`
    );
  });
});
