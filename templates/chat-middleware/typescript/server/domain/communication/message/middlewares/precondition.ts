import {CommandData, CommandMiddleware, CommandServices, CommandWithMetadata, State} from 'wolkenkit';

type CommandPreCondition<TState extends State, TCommandData extends CommandData> = ({ state, command, services }: {
    state: TState;
    command: CommandWithMetadata<TCommandData>;
    services: CommandServices<TState>;
}) => boolean | Promise<boolean>;

const precondition = function<TState extends State, TCommandData extends CommandData> (predicate: CommandPreCondition<TState, TCommandData>, message = 'Command failed.'): CommandMiddleware<TState, TCommandData> {
    return async function<TState, TCommandData>(state, command, services, next): Promise<void> {
        const isValid = await predicate({ state, command, services });

        if (!isValid) {
            throw new services.error.CommandRejected(message);
        }

        return next();
    }
}

export { precondition };
