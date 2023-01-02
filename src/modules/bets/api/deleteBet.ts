import { AuthorizedHttpRequest, httpHandler } from '@lib/wrappers/httpHandler'
import { noContent, unauthorized } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'
import { databaseBootstrap } from '@lib/bootstraps/database'

import { BetRepository } from '../repositories/BetRepository'

async function deleteBet({ context, params }: AuthorizedHttpRequest) {
  const { user } = context.authorizer.lambda
  const { betId } = params

  const betRepo = new BetRepository()

  const bet = await betRepo.fetchById(betId)

  if (bet?.userId !== user?.id) {
    return unauthorized()
  }

  await betRepo.delete(betId)

  return noContent()
}

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(httpHandler(deleteBet))
