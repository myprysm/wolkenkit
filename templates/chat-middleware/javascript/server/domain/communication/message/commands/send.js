'use strict';

const { precondition } = require('../middleware');

const send = {
  getSchema () {
    return {
      type: 'object',
      properties: {
        text: { type: 'string' }
      },
      required: [ 'text' ],
      additionalProperties: false
    };
  },

  isAuthorized () {
    return true;
  },

  middleware: [
    precondition(({ command }) => !!command.data.text, 'Text is missing'),
  ],

  handle (state, command, { aggregate }) {
    aggregate.publishDomainEvent('sent', {
      text: command.data.text
    });
  }
};

module.exports = { send };
