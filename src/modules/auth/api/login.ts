import jwt from 'jsonwebtoken'

import { httpHandler, HttpRequest } from '@lib/wrappers/httpHandler'
import { badRequest, success, unauthorized } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'
import { databaseBootstrap } from '@lib/bootstraps/database'

import { UserRepository } from '../repositories/UserRepository'
import { loginDTO } from '../dtos/loginDTO'

async function login({ body }: HttpRequest) {
  const validation = loginDTO.safeParse(body)

  if(!validation.success) {
    return badRequest({
      message: 'Invalid body',
      code: 'invalid_body',
      errors: validation.error.issues
    })
  }

  const { data } = validation

  const userRepo = new UserRepository()

  const user = await userRepo.findByPhone(data.phone)

  if(!user) {
    return unauthorized()
  }

  const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET as string)

  return success({
    token,
    user
  })
}

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(httpHandler(login))
