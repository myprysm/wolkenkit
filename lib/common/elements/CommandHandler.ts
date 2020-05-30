import { CommandData } from './CommandData';
import { CommandMiddleware } from './CommandMiddleware';
import { CommandServices } from './CommandServices';
import { CommandWithMetadata } from './CommandWithMetadata';
import { Schema } from './Schema';
import { State } from './State';

export interface CommandHandler<TState extends State, TCommandData extends CommandData> {
  getDocumentation? (): string;

  getSchema? (): Schema;

  middleware?: CommandMiddleware<TState, TCommandData>[];

  isAuthorized (state: TState, command: CommandWithMetadata<TCommandData>, services: CommandServices<TState>): boolean | Promise<boolean>;

  handle (state: TState, command: CommandWithMetadata<TCommandData>, services: CommandServices<TState>): void | Promise<void>;
}
