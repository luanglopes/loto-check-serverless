import jwt from 'jsonwebtoken'

import { httpHandler, HttpRequest } from '@lib/wrappers/httpHandler'
import { badRequest, created } from '@lib/utils/httpResponses'
import { bootstrapFactory } from '@lib/bootstrapFactory'
import { databaseBootstrap } from '@lib/bootstraps/database'

import { signupDTO } from '../dtos/signupDTO'
import { UserRepository } from '../repositories/UserRepository'

async function signup({ body }: HttpRequest) {
  const validation = signupDTO.safeParse(body)

  if(!validation.success) {
    return badRequest({
      message: 'Invalid body',
      code: 'invalid_body',
      errors: validation.error.issues
    })
  }

  const { data } = validation

  const userRepo = new UserRepository()

  const userWithPhone = await userRepo.findByPhone(data.phone)

  if(userWithPhone) {
    return badRequest({
      message: 'Phone already in use',
      code: 'phone_already_in_use',
      errors: [{
        code: 'already_in_use',
        path: ['phone']
      }]
    })
  }


  const user = await userRepo.create(data)

  const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET as string)

  return created({
    token,
    user
  })
}

const bootstrap = bootstrapFactory(databaseBootstrap)

export const handler = bootstrap(httpHandler(signup))
