import { parse } from 'https://deno.land/std@0.204.0/flags/mod.ts'
import { white } from 'https://deno.land/std@0.204.0/fmt/colors.ts'
import { logger } from './logger.ts'
import { Command } from './types.ts'

export async function executeCommand(
  command: Command,
  args: ReturnType<typeof parse>,
) {
  try {
    const parsedArgs: Record<string, unknown> = {}

    if (command.args) {
      for (const [key, value] of Object.entries(command.args)) {
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

    await command.handler({
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
