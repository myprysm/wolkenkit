import { DomainEventStore } from '../../../../stores/domainEventStore/DomainEventStore';
import { errors } from '../../../../common/errors';
import { flaschenpost } from 'flaschenpost';
import { isCustomError } from 'defekt';
import { Schema } from '../../../../common/elements/Schema';
import { Value } from 'validate-value';
import { withLogMetadata } from '../../../../common/utils/logging/withLogMetadata';
import { WolkenkitRequestHandler } from '../../../base/WolkenkitRequestHandler';

const logger = flaschenpost.getLogger();

const hasDomainEventsWithCausationId = {
  description: 'Checks wether domain events with a given causation id exist.',
  path: 'has-domain-events-with-causation-id',

  request: {
    query: {
      type: 'object',
      properties: {
        'causation-id': { type: 'string', format: 'uuid' }
      },
      required: [ 'causation-id' ],
      additionalProperties: false
    } as Schema
  },
  response: {
    statusCodes: [ 200 ],

    body: {
      type: 'object',
      properties: {
        hasDomainEventsWithCausationId: { type: 'boolean' }
      },
      required: [ 'hasDomainEventsWithCausationId' ],
      additionalProperties: false
    } as Schema
  },

  getHandler ({
    domainEventStore
  }: {
    domainEventStore: DomainEventStore;
  }): WolkenkitRequestHandler {
    const querySchema = new Value(hasDomainEventsWithCausationId.request.query),
          responseBodySchema = new Value(hasDomainEventsWithCausationId.response.body);

    return async function (req, res): Promise<any> {
      try {
        let causationId;

        try {
          querySchema.validate(req.query, { valueName: 'requestQuery' });

          causationId = req.query['causation-id'] as string;
        } catch (ex: unknown) {
          throw new errors.RequestMalformed((ex as Error).message);
        }

        const hasDomainEvents = await domainEventStore.hasDomainEventsWithCausationId({ causationId }),
              response = { hasDomainEventsWithCausationId: hasDomainEvents };

        responseBodySchema.validate(response, { valueName: 'responseBody' });

        res.json(response);
      } catch (ex: unknown) {
        const error = isCustomError(ex) ?
          ex :
          new errors.UnknownError(undefined, { cause: ex as Error });

        switch (error.code) {
          case errors.RequestMalformed.code: {
            res.status(400).json({
              code: error.code,
              message: error.message
            });

            return;
          }
          default: {
            logger.error(
              'An unknown error occured.',
              withLogMetadata('api', 'queryDomainEventStore', { error })
            );

            return res.status(400).json({
              code: error.code,
              message: error.message
            });
          }
        }
      }
    };
  }
};

export { hasDomainEventsWithCausationId };
