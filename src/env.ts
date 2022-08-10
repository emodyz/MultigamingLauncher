import { config } from 'dotenv'

interface Environment {

  APP_NAME: string
  APP_URL: string
  APP_ID: string

  UPDATER_URL: string

  ICON_PATH: string
}

export default class Env {
  public static env = config().parsed ?? {}

  static get<K extends keyof Environment> (key: K, defaultValue: Environment[K] | null = null): Environment[K] | null {
    if (this.env[key]) {
      return this.env[key]
    } else {
      return defaultValue
    }
  }
}
