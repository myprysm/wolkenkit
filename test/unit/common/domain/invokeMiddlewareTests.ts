import { assert } from 'assertthat';
import { CommandData } from '../../../../lib/common/elements/CommandData';
import { CommandMiddleware } from '../../../../lib/common/elements/CommandMiddleware';
import { CommandServices } from '../../../../lib/common/elements/CommandServices';
import { CommandWithMetadata } from '../../../../lib/common/elements/CommandWithMetadata';
import { invokeMiddleware } from '../../../../lib/common/domain/invokeMiddleware';
import { State } from '../../../../lib/common/elements/State';

interface CounterCommandData extends CommandData {
  counter: number;
}

const addMiddleware = function (value: number): CommandMiddleware<State, CounterCommandData> {
  return async function (_1, command, _2, next): Promise<void> {
    /* eslint-disable no-param-reassign */
    command.data.counter += value;
    /* eslint-enable no-param-reassign */

    return next();
  };
};

const assertCounterMiddleware = function (value: number): CommandMiddleware<State, CounterCommandData> {
  return async (_1, command, _2, next): Promise<void> => {
    assert.that(command.data.counter).is.equalTo(value);

    return next();
  };
};

suite('invokeMiddlewareTests', (): void => {
  test('returns when no middleware is provided.', async (): Promise<void> => {
    await invokeMiddleware<State, CommandData>([], {}, {} as CommandWithMetadata<CommandData>, {} as CommandServices<State>);
  });

  test('invokes each middleware in order.', async (): Promise<void> => {
    const addOne = addMiddleware(1);
    const addTwo = addMiddleware(2);

    const command = {
      data: {
        counter: 0
      }
    } as CommandWithMetadata<CounterCommandData>;

    await invokeMiddleware<State, CounterCommandData>([
      addOne,
      assertCounterMiddleware(1),
      addTwo,
      assertCounterMiddleware(3)
    ], {}, command, {} as CommandServices<State>);

    assert.that(command.data.counter).is.equalTo(3);
  });

  test('passes state, command and services to middleware.', async (): Promise<void> => {
    const state = {} as State;
    const command = {} as CommandWithMetadata<CommandData>;
    const services = {} as CommandServices<State>;

    const assertInputMiddleware: CommandMiddleware<State, CommandData> = async function (providedState, providedCommand, providedServices, next): Promise<void> {
      assert.that(providedState).is.equalTo(state);
      assert.that(providedCommand).is.equalTo(command);
      assert.that(providedServices).is.equalTo(services);

      return next();
    };

    await invokeMiddleware<State, CommandData>([ assertInputMiddleware ], state, command, services);
  });

  test('stops the chain when a middleware does not call next().', async (): Promise<void> => {
    const addNoNextMiddleware = function (value: number): CommandMiddleware<State, CounterCommandData> {
      return async function (_, command): Promise<void> {
        /* eslint-disable no-param-reassign */
        command.data.counter += value;
        /* eslint-enable no-param-reassign */
      };
    };

    const addOneNoNext = addNoNextMiddleware(1);
    const addTwoNoNext = addNoNextMiddleware(2);

    const command = {
      data: {
        counter: 0
      }
    } as CommandWithMetadata<CounterCommandData>;

    await invokeMiddleware<State, CounterCommandData>([
      addOneNoNext,

      // Not called...
      assertCounterMiddleware(1),
      addTwoNoNext,
      assertCounterMiddleware(3)
    ], {}, command, {} as CommandServices<State>);

    assert.that(command.data.counter).is.equalTo(1);
  });

  test('can execute code after chain is executed.', async (): Promise<void> => {
    const addAfterMiddleware = function (value: number): CommandMiddleware<State, CounterCommandData> {
      return async function (_1, command, _2, next): Promise<void> {
        /* eslint-disable callback-return */
        await next();
        /* eslint-enable callback-return */

        /* eslint-disable no-param-reassign */
        command.data.counter += value;
        /* eslint-enable no-param-reassign */
      };
    };

    const addOneAfter = addAfterMiddleware(1);
    const addTwoAfter = addAfterMiddleware(2);

    const command = {
      data: {
        counter: 0
      }
    } as CommandWithMetadata<CounterCommandData>;

    await invokeMiddleware<State, CounterCommandData>([
      addOneAfter,
      assertCounterMiddleware(0),
      addTwoAfter,
      assertCounterMiddleware(0)
    ], {}, command, {} as CommandServices<State>);

    assert.that(command.data.counter).is.equalTo(3);
  });
});
