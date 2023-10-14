import { parse } from 'https://deno.land/std@0.204.0/flags/mod.ts'
import { checkUpdate } from './check_update.ts'
import { executeCommand } from './execute_command.ts'
import { logger } from './logger.ts'
import { printCommandHelpMenu } from './print_command_help_menu.ts'
import { printHelpMenu } from './print_help_menu.ts'
import { printVersion } from './print_version.ts'
import { Command, Config } from './types.ts'

export async function run(
  config: Config,
  commands: Map<string, Command>,
) {
  const args = parse(Deno.args)

  await checkUpdate(config)

  if (args._[0] === 'help' || args._.length === 0 && (args.h || args.help)) {
    printHelpMenu(config, commands)
  } else if (args._.length === 0 && (args.v || args.version)) {
    printVersion(config)
  } else {
    if (typeof args._[0] !== 'string') {
      return logger.error('unknown command')
    }

    const command = commands.get(args._[0])

    if (!command) {
      return logger.error('unknown command')
    }

    if (args.h || args.help) {
      printCommandHelpMenu(config, args._[0], command)
    } else {
      await executeCommand(command, args)
    }
  }

  Deno.exit()
}
