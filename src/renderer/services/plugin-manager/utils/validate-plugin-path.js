import path from 'path'
// import fs from 'fs'

export async function validatePluginPath (app, pluginPath) {
  const structureExists = [
    'package.json',
    'src',
    'src/index.js'
  ]

  for (const pathCheck of structureExists) {
    if (!app.fs_existsSync(path.resolve(pluginPath, pathCheck))) {
      throw new Error(`'${pathCheck}' does not exist`)
    }
  }
}
