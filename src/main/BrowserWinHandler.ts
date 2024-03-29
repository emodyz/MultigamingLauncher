/* eslint-disable */
import { EventEmitter } from 'events'
import { BrowserWindow, app } from 'electron'
const DEV_SERVER_URL = process.env.DEV_SERVER_URL
const isProduction = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

export default class BrowserWinHandler {

  private _eventEmitter: EventEmitter;
  private readonly allowRecreate: boolean;
  public options: any
  public browserWindow: BrowserWindow;

  /**
   * @param [options] {object} - browser window options
   * @param [allowRecreate] {boolean}
   */
  constructor (options: any, allowRecreate = true) {
    this._eventEmitter = new EventEmitter()
    this.allowRecreate = allowRecreate
    this.options = options
    this.browserWindow = null
    this._createInstance()
  }

  _createInstance () {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
      this._create()
    })

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!this.allowRecreate) return
    app.on('activate', () => this._recreate())
  }

  _create () {
    this.browserWindow = new BrowserWindow(
      {
        ...this.options,
        webPreferences: {
          ...this.options.webPreferences,
          webSecurity: isProduction, // disable on dev to allow loading local resources
          nodeIntegration: true, // allow loading module via the require () function
          contextIsolation: false, // https://github.com/electron/electron/issues/18037#issuecomment-806320028
        }
      }
    )
    this.browserWindow.on('closed', () => {
      // Dereference the window object
      this.browserWindow = null
    })
    this._eventEmitter.emit('created')
  }

  _recreate () {
    if (this.browserWindow === null) this._create()
  }

  /**
   * @callback onReadyCallback
   * @param {BrowserWindow}
   */

  /**
   *
   * @param callback {onReadyCallback}
   */
  onCreated (callback: any) {
    if (this.browserWindow !== null) return callback(this.browserWindow);
    this._eventEmitter.once('created', () => {
      callback(this.browserWindow)
      if (isDev && BrowserWindow.getAllWindows().length === 1) this.browserWindow.webContents.openDevTools()
    })
  }

  async loadPage(pagePath: string) {
    if (!this.browserWindow) return Promise.reject(new Error('The page could not be loaded before win \'created\' event'))
    const serverUrl = isDev ? DEV_SERVER_URL : 'app://./index.html'
    const fullPath = serverUrl + '#' + pagePath;
    await this.browserWindow.loadURL(fullPath)
  }

  /**
   *
   * @returns {Promise<BrowserWindow>}
   */
  created () {
    return new Promise(resolve => {
      this.onCreated(() => resolve(this.browserWindow))
    })
  }
}
