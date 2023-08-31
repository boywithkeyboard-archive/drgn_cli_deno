import { parse } from 'https://deno.land/std@0.200.0/flags/mod.ts'
import {
  brightYellow,
  gray,
  underline,
  white,
} from 'https://deno.land/std@0.200.0/fmt/colors.ts'
import { logger } from './logger.ts'
import { Command, Config } from './types.ts'

export async function run(
  config: Config,
  commands: [string, Command][],
) {
  const args = parse(Deno.args)

  if (config.version) {
    if (typeof config.checkUpdate === 'function') {
      const latestVersion = await config.checkUpdate()

      if (latestVersion !== config.version) {
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

  if (args._[0] === 'help' || args._.length === 0 && (args.h || args.help)) { // help menu
    let commandsList = ''

    if (commands.length > 0) {
      for (const c of commands) {
        commandsList += `\n${white(c[0])}`
        if (c[1].description) {
          commandsList += ` - ${c[1].description}`
        }
      }
    }

    console.log(gray(`
${white(`${config.name}`)} <command>

${underline('Commands:')}

${white('help')} - Print this message.${commandsList}

${underline('Options:')}

${white('-v')}, ${white('--version')} - Print version.
${white('-h')}, ${white('--help')} - Print the help menu of a command.
`))
  } else if (args._.length === 0 && (args.v || args.version)) {
    console.info(gray(white(config.name) + ' ' + (config.version ?? '?')))
  } else {
    const command = commands.filter((c) => c[0] === args._[0])[0]

    if (!command) {
      return logger.error('unknown command')
    }

    if (args.h || args.help) { // command help menu
      let argsList = ''

      if (command[1].args) {
        for (const [key, value] of Object.entries(command[1].args)) {
          argsList += `\n${white(key)}`
          if (value.description) {
            argsList += ` - ${value.description}`
          }
        }
      }

      console.log(gray(`
${white(`${config.name}`)} ${command[0]}

${underline('Options:')}

${white('-h')}, ${white('--help')} - Print this message.${argsList}
`))
    } else { // command
      try {
        const parsedArgs: Record<string, unknown> = {}

        if (command[1].args) {
          for (const [key, value] of Object.entries(command[1].args)) {
            let arg = args[key]

            if (!arg && typeof value.alias === 'string') {
              arg = args[value.alias]
            }

            const { success, data } = value.schema.safeParse(arg) as {
              success: true
              data: unknown
            } | { success: false; data: undefined }

            if (!success) {
              return logger.error(`malformed option: ${white(`--${key}`)}`)
            }

            parsedArgs[key] = data
          }
        }

        await command[1].handler({
          args,
          arg(name) {
            return parsedArgs[name]
          },
        })
      } catch (err) {
        return logger.error(
          err instanceof Error ? err.message : 'unknown error',
        )
      }
    }
  }

  Deno.exit()
}
