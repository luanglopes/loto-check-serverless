import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda"

export function response(body: object | undefined = undefined, statusCode = 200, headers = {}): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    body: body && JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  }
}

export function success<T extends object>(body: T) {
  return response(body)
}

export function created<T extends object>(body: T) {
  return response(body, 201)
}

export function badRequest<T extends object>(body: T, statusCode = 400) {
  return response(body, statusCode)
}

export function internalError<T extends object>(body: T) {
  return response(body, 500)
}

export function unauthorized() {
  return response({ message: 'Unauthorized' }, 401)
}

export function notFound<T extends object>(body: T) {
  return response(body, 404)
}

export function noContent() {
  return response(undefined, 204)
}
