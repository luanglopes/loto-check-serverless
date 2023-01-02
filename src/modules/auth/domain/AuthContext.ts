import type { APIGatewayAuthorizerResultContext, APIGatewayProxyEventV2, APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda"
import { User } from "./User"

export type AuthContext = {
  user: User | null
}

type CustomAuth = APIGatewayAuthorizerResultContext & AuthContext

export type AuthorizedHttpEvent = APIGatewayProxyEventV2WithLambdaAuthorizer<CustomAuth>

export type HttpEvent = APIGatewayProxyEventV2
