import type { Context } from "aws-lambda"

type BootstrapFunction = {
  init(): Promise<void>
}

export function bootstrapFactory(...bootstrapFunctions: BootstrapFunction[]) {
  return function<T extends (...args: any) => Promise<any>>(handler: T) {
    return async function(event: Parameters<T>[0], context: Context): Promise<Awaited<ReturnType<T>>> {
      for (const bsFunction of bootstrapFunctions) {
        await bsFunction.init()
      }

      const result = await handler(event, context)

      return result
    }
  }
}
