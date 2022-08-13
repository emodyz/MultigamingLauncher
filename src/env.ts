// eslint-disable-next-line import/default
import { config } from 'dotenv'

interface Environment {

  APP_NAME: string
  APP_URL: string
  APP_ID: string

  APP_VERSION: string

  ICON_PATH: string
}

// Setup env
config()

export default class Env {
  public static env: any = process.env ?? {}

  static get<K extends keyof Environment> (key: K, defaultValue: Environment[K] | null = null): Environment[K] | null {
    if (this.env[key]) {
      return this.env[key]
    } else {
      return defaultValue
    }
  }
}
