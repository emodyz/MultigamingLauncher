import { app } from 'electron'

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

// Load here all startup windows
require('./helpers')
require('./modules')
require('./communicator')
require('./mainWindow')
