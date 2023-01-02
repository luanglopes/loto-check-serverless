import camelcase from 'camelcase-keys'
import snakecase from 'snakecase-keys'

import { dbClient } from "@lib/clients/dbClient";

import { User } from '../domain/User';
import { CreateData, UpdateData } from '@lib/utils/dbTypes';

export class UserRepository {
  private allFields = ['id', 'phone']
  private hiddenFields: string[] = []

  private get fields() {
    return this.allFields.filter(field => !this.hiddenFields.includes(field))
  }

  async findByPhone(phone: string): Promise<User | null> {
    const result = await dbClient.query(`SELECT ${this.fields.join(',')} FROM users WHERE phone = $1`, [phone])

    const data = result.rows[0]

    return data ? camelcase(data) : null
  }

  async create(data: CreateData<User>): Promise<User> {
    let fields: string[] = []
    let values: any[] = []

    const snakedData = snakecase(data)

    Object.keys(snakedData).forEach((field) => {
      const value = snakedData[field as keyof typeof snakedData]

      fields.push(field)
      values.push(value)
    })

    const result = await dbClient.query(
      `INSERT INTO users (${fields.join(',')}) VALUES (${fields.map((_,i) => `$${i+1}`).join(',')}) RETURNING ${this.fields.join(',')}`,
      values,
    )

    await dbClient.query('commit')

    const created = result.rows[0]

    return camelcase(created)
  }

  async update(data: UpdateData<User>): Promise<User> {
    let assignments: string[] = []
    let values: any[] = []

    const { id, ...snakedData} = snakecase(data)

    Object.keys(snakedData).forEach((field, i) => {
      const value = snakedData[field as keyof typeof snakedData]

      assignments.push(`${field} = $${i+1}`)
      values.push(value)
    })

    values.push(id)

    const result = await dbClient.query(
      `UPDATE users SET ${assignments.join(',')} WHERE id = $${values.length} RETURNING ${this.fields.join(',')}`,
      values,
    )

    await dbClient.query('commit')

    const updated = result.rows[0]

    return camelcase(updated)
  }
}
