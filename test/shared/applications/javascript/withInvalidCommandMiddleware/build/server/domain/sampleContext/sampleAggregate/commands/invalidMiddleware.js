'use strict';

const invalidMiddleware = {
  getSchema () {
    return {
      type: 'object',
      properties: {
        strategy: { type: 'string', enum: [ 'succeed', 'fail', 'reject' ]}
      },
      required: [ 'strategy' ],
      additionalProperties: false
    };
  },

  isAuthorized () {
    return true;
  },

  middleware: [ 1 ],

  handle (state, command, { aggregate, error }) {
    const { strategy } = command.data;

    if (strategy === 'fail') {
      throw new Error('Intentionally failed execute.');
    }

    if (strategy === 'reject') {
      throw new error.CommandRejected('Intentionally rejected execute.');
    }

    aggregate.publishDomainEvent('succeeded', {});
    aggregate.publishDomainEvent('executed', { strategy });
  }
};

module.exports = {
  invalidMiddleware
};
