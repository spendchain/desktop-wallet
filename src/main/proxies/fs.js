import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import trash from 'trash'
import { PLUGINS } from '../../../config'

const pluginPath = process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath

class FsProxy {
  static validatePath (fsPath) {
    if (path.resolve(fsPath) !== path.normalize(fsPath).replace(RegExp(path.sep + '$'), '')) {
      throw new Error(`"${fsPath}" is not an absolute path`)
    }

    if (!fsPath.startsWith(__dirname) && !fsPath.startsWith(pluginPath)) {
      throw new Error(`Blocked path "${fsPath}"`)
    }
  }

  static getHomeDir () {
    return os.homedir()
  }

  static ensureDirSync (fsPath) {
    this.validatePath(fsPath)

    return fs.ensureDirSync(fsPath)
  }

  static readFileSync (fsPath) {
    this.validatePath(fsPath)

    return fs.readFileSync(fsPath)
  }

  static readdirSync (fsPath) {
    this.validatePath(fsPath)

    const entries = {
      files: [],
      directories: []
    }

    for (const entry of fs.readdirSync(fsPath)) {
      if (fs.lstatSync(`${fsPath}/${entry}`).isDirectory()) {
        entries.directories.push(entry)
      } else {
        entries.files.push(entry)
      }
    }

    return entries
  }

  // static lstatSync (fsPath) {
  //   this.validatePath(fsPath)

  //   return fs.lstatSync(fsPath)
  // }

  static existsSync (fsPath) {
    this.validatePath(fsPath)

    return fs.existsSync(fsPath)
  }

  static trash (fsPath) {
    this.validatePath(fsPath)

    return trash(fsPath)
  }
}

export default FsProxy
