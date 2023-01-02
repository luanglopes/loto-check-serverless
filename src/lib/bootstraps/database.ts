import { dbClient } from "../clients/dbClient"

export const databaseBootstrap = {
  isConnected: false,
  async init() {
    if(!this.isConnected) {
      await dbClient.connect()
      this.isConnected = true

      console.log('Connected to DB')
    }
  }
}
