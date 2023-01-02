import { AuthorizedHttpRequest, httpHandler } from '@lib/wrappers/httpHandler'
import { success } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'
import { databaseBootstrap } from '@lib/bootstraps/database'

import { BetRepository } from '../repositories/BetRepository'

async function listBets({ context }: AuthorizedHttpRequest) {
  const { user } = context.authorizer.lambda

  const betRepo = new BetRepository()

  const bets = await betRepo.list(user!.id)

  return success({ bets })
}

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(httpHandler(listBets))
