import { AuthorizedHttpRequest, httpHandler } from '@lib/wrappers/httpHandler'
import { badRequest, notFound, success, unauthorized } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'
import { databaseBootstrap } from '@lib/bootstraps/database'

import { BetRepository } from '../repositories/BetRepository'
import { updateBetDTO } from '../dtos/updateBetDTO'

async function updateBet({ context, body, params }: AuthorizedHttpRequest) {
  const { user } = context.authorizer.lambda
  const { betId } = params

  const validation = updateBetDTO.safeParse({ ...body, id: betId })

  if(!validation.success) {
    return badRequest({
      message: 'Invalid body',
      code: 'invalid_body',
      errors: validation.error.issues
    })
  }

  const { data } = validation

  const betRepo = new BetRepository()

  const bet = await betRepo.fetchById(data.id)

  if (!bet) {
    return notFound({
      message: 'Bet not found',
      code: 'bet_not_found',
    })
  }

  if (bet.userId !== user?.id) {
    return unauthorized()
  }

  const updatedBet = await betRepo.update(data)

  return success({ bet: updatedBet })
}

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(httpHandler(updateBet))
