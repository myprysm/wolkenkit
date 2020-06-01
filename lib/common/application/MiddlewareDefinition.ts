import { CommandData } from '../elements/CommandData';
import { CommandMiddleware } from '../elements/CommandMiddleware';
import { State } from '../elements/State';

export interface MiddlewareDefinition {
  command: CommandMiddleware<State, CommandData>[];
}
