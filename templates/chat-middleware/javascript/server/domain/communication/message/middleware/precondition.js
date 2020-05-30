'use strict';

const precondition = function (predicate, message = 'Command failed.') {
    return async function(state, command, services, next) {
        const isValid = await predicate({ state, command, services });

        if (!isValid) {
            throw new services.error.CommandRejected(message);
        }

        return next();
    }
}

export { precondition };
