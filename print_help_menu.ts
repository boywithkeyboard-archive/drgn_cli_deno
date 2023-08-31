import {
  gray,
  underline,
  white,
} from 'https://deno.land/std@0.200.0/fmt/colors.ts'
import { Command, Config } from './types.ts'

export function printHelpMenu(
  config: Config,
  commands: Map<string, Command>,
) {
  let commandsList = ''

  if (commands.size > 0) {
    for (const [key, value] of commands) {
      commandsList += `\n${white(key)}`

      if (value.description) {
        commandsList += ` - ${value.description}`
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
}
