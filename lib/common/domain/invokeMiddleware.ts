import { CommandData } from '../elements/CommandData';
import { CommandMiddleware } from '../elements/CommandMiddleware';
import { CommandServices } from '../elements/CommandServices';
import { CommandWithMetadata } from '../elements/CommandWithMetadata';
import { State } from '../elements/State';

const invokeMiddleware = async function<TState extends State, TCommandData extends CommandData> (middleware: CommandMiddleware<TState, TCommandData>[], state: TState, command: CommandWithMetadata<TCommandData>, services: CommandServices<TState>): Promise<void> {
  if (middleware.length === 0) {
    return;
  }

  const current = middleware[0];
  const next = async (): Promise<void> => invokeMiddleware(middleware.slice(1), state, command, services);

  return current(state, command, services, next);
};

export { invokeMiddleware };
