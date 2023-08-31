import {
  gray,
  underline,
  white,
} from 'https://deno.land/std@0.200.0/fmt/colors.ts'
import { Command, Config } from './types.ts'

export function printCommandHelpMenu(
  config: Config,
  name: string,
  command: Command,
) {
  let argsList = ''

  if (command.args) {
    for (const [key, value] of Object.entries(command.args)) {
      argsList += `\n${white(key)}`
      if (value.description) {
        argsList += ` - ${value.description}`
      }
    }
  }

  console.log(gray(`
${white(`${config.name}`)} ${name}

${underline('Options:')}

${white('-h')}, ${white('--help')} - Print this message.${argsList}
`))
}
