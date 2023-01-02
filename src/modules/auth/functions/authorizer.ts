import jwt, { JwtPayload } from 'jsonwebtoken'
import type { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda'

import { bootstrapFactory } from '@lib/bootstrapFactory';
import { databaseBootstrap } from '@lib/bootstraps/database';

import type { AuthContext } from '../domain/AuthContext';
import { UserRepository } from '../repositories/UserRepository';

async function authorizer(event: APIGatewayRequestAuthorizerEventV2): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthContext>> {
  let response: APIGatewaySimpleAuthorizerWithContextResult<AuthContext> = {
    isAuthorized: false,
    context: {
      user: null
    }
  };

  const source = event.identitySource[0]

  if (!source) {
    return response
  }

  const [, token] = source.split(' ')

  if (!token) {
    return response
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    const userRepo = new UserRepository()

    const user = await userRepo.findByPhone(payload.phone)

    response = {
      isAuthorized: true,
      context: {
        user: user
      }
    };
  } catch (error) {
    console.log(error)
  }

  return response;
};

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(authorizer)
