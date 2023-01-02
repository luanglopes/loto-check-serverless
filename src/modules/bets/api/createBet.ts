import { AuthorizedHttpRequest, httpHandler } from '@lib/wrappers/httpHandler'
import { badRequest, created } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'
import { databaseBootstrap } from '@lib/bootstraps/database'

import { createBetDTO } from '../dtos/createBetDTO'
import { BetRepository } from '../repositories/BetRepository'

async function createBet({ context, body }: AuthorizedHttpRequest) {
  const { user } = context.authorizer.lambda

  const validation = createBetDTO.safeParse(body)

  if(!validation.success) {
    return badRequest({
      message: 'Invalid body',
      code: 'invalid_body',
      errors: validation.error.issues
    })
  }

  const { data } = validation

  const betRepo = new BetRepository()

  const bet = await betRepo.create({ ...data, userId: user!.id})

  return created({ bet })
}

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(httpHandler(createBet))
