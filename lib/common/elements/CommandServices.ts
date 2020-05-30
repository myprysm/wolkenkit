import { AggregateService } from '../services/AggregateService';
import { AggregatesService } from '../services/AggregatesService';
import { ClientService } from '../services/ClientService';
import { ErrorService } from '../services/ErrorService';
import { LockService } from '../services/LockService';
import { LoggerService } from '../services/LoggerService';
import { State } from './State';

export interface CommandServices<TState extends State> {
  aggregate: AggregateService<TState>;
  aggregates: AggregatesService;
  client: ClientService;
  error: ErrorService;
  lock: LockService;
  logger: LoggerService;
}
