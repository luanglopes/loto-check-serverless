import { AuthorizedHttpRequest, httpHandler } from '@lib/wrappers/httpHandler'
import { success, unauthorized } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'

async function getProfile({ context }: AuthorizedHttpRequest) {
  if(!context.authorizer.lambda.user) {
    return unauthorized()
  }

  return success({
    user: context.authorizer.lambda.user
  })
}

const bootstrap = bootstrapFactory()

export const handler = bootstrap(httpHandler(getProfile))
