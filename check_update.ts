import {
  brightYellow,
  white,
} from 'https://deno.land/std@0.200.0/fmt/colors.ts'
import { Config } from './types.ts'

export async function checkUpdate(config: Config) {
  if (!config.version) {
    return
  }

  if (typeof config.checkUpdate === 'function') {
    let latestVersion

    try {
      latestVersion = await config.checkUpdate()
    } catch (_) {
      //
    }

    if (typeof latestVersion === 'string' && latestVersion !== config.version) {
      console.clear()
      console.warn(
        `${brightYellow('update available')} - please upgrade to ${
          white(latestVersion)
        }!`,
      )
    }
  } else if (config.checkUpdate !== undefined) {
    let latestVersion

    try {
      if (config.checkUpdate.registry === 'deno.land') {
        const res = await fetch(
          `https://apiland.deno.dev/v2/modules/${config.checkUpdate.moduleName}`,
        )

        if (!res.ok) {
          return
        }

        const json = await res.json() as { latest_version: string }

        latestVersion = json.latest_version
      }
    } catch (_) {
      //
    }

    if (
      typeof latestVersion === 'string' && latestVersion !== config.version
    ) {
      console.clear()
      console.warn(
        `${brightYellow('update available')} - please upgrade to ${
          white(latestVersion)
        }!`,
      )
    }
  }
}
