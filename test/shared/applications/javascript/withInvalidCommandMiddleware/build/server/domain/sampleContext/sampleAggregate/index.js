'use strict';

const { invalidMiddleware } = require('./commands/invalidMiddleware'),
      { authenticated } = require('./domainEvents/authenticated'),
      { authorized } = require('./domainEvents/authorized'),
      { executed } = require('./domainEvents/executed'),
      { succeeded } = require('./domainEvents/succeeded'),
      { getInitialState } = require('./SampleState');

const sampleAggregate = {
  getInitialState,
  commandHandlers: {
    invalidMiddleware
  },
  domainEventHandlers: {
    authenticated,
    authorized,
    succeeded,
    executed
  }
};

module.exports = sampleAggregate;
