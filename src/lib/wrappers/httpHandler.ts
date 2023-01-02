import type { APIGatewayProxyEventHeaders, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import type { AuthorizedHttpEvent, HttpEvent } from 'src/modules/auth/domain/AuthContext'

import { internalError } from '@lib/utils/httpResponses'

type BaseHttpRequest<B = object> = {
  body: B | null
  headers: APIGatewayProxyEventHeaders
  params: Record<string, string>
}

export type HttpRequest<B = object> = BaseHttpRequest<B> & {
  context: HttpEvent['requestContext']
}

export type AuthorizedHttpRequest = BaseHttpRequest & {
  context: AuthorizedHttpEvent['requestContext']
}

type HttpHandler<T> = (httpReq: T) => Promise<APIGatewayProxyResultV2>

function parseBody({ body, headers }: APIGatewayProxyEventV2) {
  if(!body) {
    return null
  }

  const { 'content-type': contentType } = headers

  if(contentType === 'application/json') {
    return JSON.parse(body)
  }

  return body
}

export function httpHandler<T>(handler: HttpHandler<T>) {
  type EventType = T extends AuthorizedHttpRequest ?  AuthorizedHttpEvent : HttpEvent

  return async function(event: EventType) {
    try {
      const result = await handler({
        body: parseBody(event),
        headers: event.headers,
        context: event.requestContext,
        params: event.pathParameters
      } as T)

      return result
    } catch (error) {
      console.log(error)

      return internalError({
        message: 'Internal error'
      })
    }
  }
}
