import * as adapters from '@/services/plugin-manager/adapters'
import releaseService from '@/services/release'
import { PLUGINS } from '@config'
import dayjs from 'dayjs'
import ky from 'ky'
import { partition, upperFirst } from 'lodash'
import * as path from 'path'
import semver from 'semver'
import * as errors from './plugin-manager/errors'
import { Plugin } from './plugin-manager/plugin'
import { PluginConfiguration } from './plugin-manager/plugin-configuration'
import { PluginSandbox } from './plugin-manager/plugin-sandbox'
import { PluginSetup } from './plugin-manager/plugin-setup'
import { validatePluginPath } from './plugin-manager/utils/validate-plugin-path'
import validatePackageName from 'validate-npm-package-name'

let rootPath = path.resolve(__dirname, '../../../')
if (process.env.NODE_ENV === 'production') {
  rootPath = path.resolve(__dirname, '../../')
}

export class PluginManager {
  constructor () {
    this.app = null
    this.adapter = null
    this.pluginsPath = null
    this.plugins = {}
    this.pluginSetups = {}
    this.hasInit = false
    this.vue = null
  }

  setAdapter (adapter) {
    this.adapter = adapters[upperFirst(adapter) + 'Adapter']
  }

  setApp (app) {
    this.app = app
  }

  setVue (vue) {
    this.vue = vue
  }

  async init (app) {
    this.setApp(app)

    this.pluginsPath = process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath
    this.pluginsPath = `${await app.fs_getHomeDir()}${this.pluginsPath}`

    await this.app.$store.dispatch('plugin/reset')
    await this.fetchPlugins()

    this.hasInit = true

    await this.app.$store.dispatch('plugin/loadPluginsForProfiles')
  }

  async deletePlugin (pluginId) {
    if (!this.hasInit) {
      throw new errors.NotInitiatedError()
    }

    const plugin = this.plugins[pluginId]
    if (!plugin) {
      throw new errors.PluginNotFoundError(pluginId)
    }

    const parentDir = path.dirname(plugin.fullPath)
    const pluginCount = (await this.app.fs_readdirSync(parentDir)).directories.filter(entry => {
      return !entry.startsWith('.')
    }).length

    if (parentDir !== this.pluginsPath && pluginCount === 1) {
      await this.app.fs_trash(parentDir)
    } else {
      await this.app.fs_trash(plugin.fullPath)
    }

    this.app.$store.dispatch('plugin/deleteInstalled', plugin.config.id)

    delete this.plugins[pluginId]
  }

  async enablePlugin (pluginId, profileId) {
    if (!this.hasInit) {
      throw new errors.NotInitiatedError()
    }

    const plugin = this.plugins[pluginId]
    if (!plugin) {
      throw new errors.PluginNotFoundError(pluginId)
    }

    if (!this.app.$store.getters['plugin/isEnabled'](plugin.config.id, profileId)) {
      throw new errors.PluginStatusError('enabled', plugin.config.id)
    }

    if (!this.app.$store.getters['plugin/isInstalledSupported'](plugin.config.id)) {
      throw new errors.PluginWalletVersionError()
    }

    await this.app.$store.dispatch('plugin/setLoaded', {
      config: plugin.config,
      fullPath: plugin.fullPath,
      profileId
    })

    const sandbox = new PluginSandbox({
      plugin,
      app: this.app
    })

    await sandbox.install()

    const setup = new PluginSetup({
      app: this.app,
      plugin,
      sandbox,
      profileId,
      vue: this.vue
    })

    await setup.install()

    this.pluginSetups[pluginId] = setup
  }

  async unloadThemes (plugin, profileId) {
    const defaultThemes = ['light', 'dark']

    if (!defaultThemes.includes(this.app.$store.getters['session/theme'])) {
      await this.app.$store.dispatch('session/setTheme', defaultThemes[0])

      const profile = this.app.$store.getters['profile/byId'](profileId)

      await this.app.$store.dispatch('profile/update', {
        ...profile,
        ...{ theme: defaultThemes[0] }
      })
    }
  }

  getWalletTabComponent (pluginId) {
    const plugin = this.plugins[pluginId]

    if (!plugin) {
      return {}
    }

    return plugin.getWalletTabComponent()
  }

  getAvatarComponents (pluginId) {
    const plugin = this.plugins[pluginId]

    if (!plugin) {
      return {}
    }

    return plugin.getAvatarComponents()
  }

  // TODO hook to clean up and restore or reset values
  async disablePlugin (pluginId, profileId) {
    if (!this.hasInit) {
      throw new errors.NotInitiatedError()
    }

    const plugin = this.plugins[pluginId]
    if (!plugin) {
      throw new errors.PluginNotFoundError(pluginId)
    }

    if (this.app.$store.getters['plugin/isEnabled'](plugin.config.id, profileId)) {
      throw new errors.PluginStatusError('disabled', plugin.config.id)
    }

    if (plugin.config.permissions.includes('THEMES')) {
      await this.unloadThemes(plugin, profileId)
    }

    await this.app.$store.dispatch('plugin/deleteLoaded', { pluginId, profileId })

    if (this.pluginSetups[pluginId]) {
      await this.pluginSetups[pluginId].destroy()
    }
  }

  async fetchLogo (url) {
    const response = await fetch(new Request(url), {
      method: 'GET',
      cache: 'default'
    })

    const buffer = await response.arrayBuffer()

    let image = ''
    for (const byte of new Uint8Array(buffer)) {
      image += String.fromCharCode(byte)
    }

    if (!image) {
      return ''
    }

    return btoa(image)
  }

  async fetchPluginsFromAdapter () {
    console.log('fetchPluginsFromAdapter')
    const sessionAdapter = this.app.$store.getters['session/pluginAdapter']
    if (this.adapter !== sessionAdapter) {
      this.setAdapter(sessionAdapter)
    }

    console.log('adapter', this.adapter, sessionAdapter)

    let configs = await this.adapter.all(this.app)

    configs = await Promise.all(configs.map(async config => {
      const plugin = await PluginConfiguration.sanitize(config)

      try {
        plugin.logo = await this.fetchLogo(plugin.logo)
      } catch (error) { }

      const validName = validatePackageName(plugin.id).validForNewPackages
      if (!validName) {
        console.info(`${plugin.id} is not a valid package name`)
      }

      const minVersionSatisfied = !plugin.minVersion || semver.gte(releaseService.currentVersion, plugin.minVersion)
      if (!minVersionSatisfied) {
        console.info(`${plugin.id} requires a higher wallet version`)
      }

      if (validName && minVersionSatisfied) {
        return plugin
      }
    }))

    const plugins = configs.reduce((plugins, config) => {
      plugins[config.id] = { config }
      return plugins
    }, {})

    this.app.$store.dispatch('plugin/setAvailable', plugins)
  }

  parsePluginUrl (url) {
    const matches = /https?:\/\/github.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)[/]?$/.exec(url)

    return {
      owner: matches[1],
      repository: matches[2],
      branch: 'master'
    }
  }

  async fetchPluginFromUrl (url) {
    const { owner, repository, branch } = this.parsePluginUrl(url)

    const baseUrl = `https://raw.githubusercontent.com/${owner}/${repository}/${branch}`
    const { body } = await ky(`${baseUrl}/package.json`).json()

    let plugin

    try {
      plugin = await PluginConfiguration.sanitize(body)
    } catch (error) {
      throw new errors.PluginConfigError(error.message)
    }

    plugin.source = `https://github.com/${owner}/${repository}/archive/${branch}.zip`

    try {
      plugin.logo = await this.fetchLogo(plugin.logo)
    } catch (error) { }

    return plugin
  }

  async fetchPlugins (force = false) {
    const requests = [this.fetchPluginsFromPath()]

    if (force || dayjs().isAfter(dayjs(this.app.$store.getters['plugin/lastFetched']).add(
      PLUGINS.updateInterval.value, PLUGINS.updateInterval.unit
    ))) {
      requests.push(this.fetchPluginsFromAdapter(), this.fetchBlacklist())
    }

    await Promise.all(requests)
  }

  async fetchPluginsFromPath () {
    await this.app.fs_ensureDirSync(this.pluginsPath)

    const dirs = (await this.app.fs_readdirSync(this.pluginsPath)).directories.filter((entry) => {
      return entry !== '.cache'
    })

    const [scoped, unscoped] = partition(dirs, entry => {
      return entry.startsWith('@')
    })

    const plugins = unscoped

    for (const scope of scoped) {
      const scopePath = `${this.pluginsPath}/${scope}`

      const entries = (await this.app.fs_readdirSync(scopePath)).directories

      plugins.push(...entries.map(entry => `${scope}/${entry}`))
    }

    for (const plugin of plugins) {
      const pluginPath = `${this.pluginsPath}/${plugin}`

      try {
        await this.fetchPlugin(pluginPath)
      } catch (error) {
        console.error(`Could not fetch plugin '${pluginPath}': ${error.message}`)
      }
    }
  }

  async fetchBlacklist () {
    try {
      const body = await ky(PLUGINS.blacklistUrl).json()
      this.app.$store.dispatch('plugin/setBlacklisted', { scope: 'global', plugins: body.plugins })
    } catch (error) {
      console.error(`Could not fetch blacklist from '${PLUGINS.blacklistUrl}: ${error.message}`)
    }
  }

  async fetchPlugin (pluginPath, isUpdate = false) {
    await validatePluginPath(this.app, pluginPath)

    const packageJson = JSON.parse((await this.app.fs_readFileSync(`${pluginPath}/package.json`)).toString())
    const pluginConfig = await PluginConfiguration.sanitize(packageJson, pluginPath)

    if (this.plugins[pluginConfig.id] && !isUpdate) {
      throw new errors.PluginAlreadyLoadedError(pluginConfig.id)
    }

    const pluginLogo = pluginConfig.logo
    pluginConfig.logo = null
    try {
      pluginConfig.logo = (await this.app.fs_readFileSync(`${pluginPath}/logo.png`)).toString('base64')
    } catch (error) {
      try {
        if (pluginLogo) {
          pluginConfig.logo = await this.fetchLogo(pluginLogo)
        }
      } catch (error) {
        //
      }
    }

    const fullPath = pluginPath.substring(0, 1) === '/' ? pluginPath : path.resolve(pluginPath)
    await this.app.$store.dispatch('plugin/setInstalled', {
      config: pluginConfig,
      fullPath
    })

    this.plugins[pluginConfig.id] = new Plugin({
      config: pluginConfig,
      path,
      fullPath,
      rootPath
    })
  }
}

export default new PluginManager()
