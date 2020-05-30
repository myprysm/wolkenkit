import { CommandData } from './CommandData';
import { CommandServices } from './CommandServices';
import { CommandWithMetadata } from './CommandWithMetadata';
import { State } from './State';

type Next = () => void | Promise<void>;

export type CommandMiddleware<TState extends State, TCommandData extends CommandData> = (state: TState, command: CommandWithMetadata<TCommandData>, services: CommandServices<TState>, next: Next) => Promise<void> | void;
