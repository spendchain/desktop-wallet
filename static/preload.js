const { app, ipcRenderer, remote } = require('electron')
const { NodeVM } = require('vm2')
const logger = require('electron-log')

const Menu = remote.Menu
const contextInputMenu = Menu.buildFromTemplate([
  { role: 'cut' },
  { role: 'copy' },
  { role: 'paste' },
  { type: 'separator' },
  { role: 'selectall' }
])

const createVmSandbox = function (options) {
  return new NodeVM(options)
}

const ipcRendererSandbox = function (options) {
  return {
    on (eventName, callback) {
      ipcRenderer.on(eventName, callback)
    },

    send (eventName, data) {
      ipcRenderer.send(eventName, data)
    },

    removeListener (eventName, callback) {
      ipcRenderer.removeListener(eventName, callback)
    }
  }
}

const setContentProtection = function (enabled) {
  remote.getCurrentWindow().setContentProtection(enabled)
}

const openContextMenu = function (enabled) {
  contextInputMenu.popup(remote.getCurrentWindow())
}

const checks = {
  createVmSandbox,
  ipcRenderer: ipcRendererSandbox,
  openContextMenu,
  setContentProtection
}

window.logger = logger
for (const check of Object.keys(checks)) {
  window[check] = checks[check]
}

const timerId = setInterval(() => {
  for (const check of Object.keys(checks)) {
    if (window[check] !== checks[check]) {
      clearInterval(timerId)
      window.location.reload()
    }
  }
}, 1000)
