import camelcase from 'camelcase-keys'
import snakecase from 'snakecase-keys'

import type { CreateData, UpdateData } from '@lib/utils/dbTypes'
import { dbClient } from '@lib/clients/dbClient';
import { Bet } from '../domain/Bet';

export class BetRepository {
  private allFields = ['id', 'numbers', 'user_id', 'created_at']
  private hiddenFields: string[] = []

  private get fields() {
    return this.allFields.filter(field => !this.hiddenFields.includes(field))
  }

  async fetchById(id: string): Promise<Bet | null> {
    const result = await dbClient.query(`SELECT ${this.fields.join(',')} FROM bets WHERE id = $1`, [id])

    const data = result.rows[0]

    return camelcase(data)
  }

  async list(userId: string): Promise<Bet[]> {
    const result = await dbClient.query(`SELECT ${this.fields.join(',')} FROM bets WHERE user_id = $1 ORDER BY created_at DESC`, [userId])

    const data = result.rows

    return camelcase(data)
  }

  async create(data: CreateData<Bet & { userId: string }>): Promise<Bet> {
    let fields: string[] = []
    let values: any[] = []

    const snakedData = snakecase(data)

    Object.keys(snakedData).forEach((field) => {
      const value = snakedData[field as keyof typeof snakedData]


      fields.push(field)
      if (field === 'numbers') {
        values.push(JSON.stringify(value))
      } else {
        values.push(value)
      }
    })

    const result = await dbClient.query(
      `INSERT INTO bets (${fields.join(',')}) VALUES (${fields.map((_,i) => `$${i+1}`).join(',')}) RETURNING ${this.fields.join(',')}`,
      values,
    )

    await dbClient.query('commit')

    const created = result.rows[0]

    return camelcase(created)
  }

  async update(data: UpdateData<Bet & { userId: string }>): Promise<Bet> {
    let assignments: string[] = []
    let values: any[] = []

    const { id, ...snakedData} = snakecase(data)

    Object.keys(snakedData).forEach((field, i) => {
      const value = snakedData[field as keyof typeof snakedData]

      assignments.push(`${field} = $${i+1}`)
      if (field === 'numbers') {
        values.push(JSON.stringify(value))
      } else {
        values.push(value)
      }
    })

    values.push(id)

    const result = await dbClient.query(
      `UPDATE bets SET ${assignments.join(',')} WHERE id = $${values.length} RETURNING ${this.fields.join(',')}`,
      values,
    )

    await dbClient.query('commit')

    const updated = result.rows[0]

    return camelcase(updated)
  }

  async delete(betId: string) {
    await dbClient.query(`DELETE FROM bets WHERE id = $1`, [betId])
  }
}
