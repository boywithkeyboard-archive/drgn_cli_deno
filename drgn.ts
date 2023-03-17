import { parse } from 'https://deno.land/std@v0.180.0/flags/mod.ts'
import { bold, gray, italic, underline, white } from 'https://deno.land/std@v0.180.0/fmt/colors.ts'
import log, { error } from './log.ts'
import ms from 'https://cdn.skypack.dev/ms@2.1.3?dts'
import type { Command } from './Command.ts'
import type { Option } from './Option.ts'
import type { ParsedArgs } from './ParsedArgs.d.ts'

export class drgn {
  private c
  private o
  private n: string | undefined

  constructor() {
    this.c = new Map<string, Command | string>()
    this.o = new Map<string, Option | string>()

    this.run = this.run.bind(this)
  } 

  private async executeCommand(args: ParsedArgs) {
    if (typeof args._[0] !== 'string') {
      await error(`command not found. try ${underline(`${this.n} --help`)}`)

      Deno.exit(1)
    }

    let command = this.c.get(args._[0])

    if (!command) {
      await error(`command not found. try ${underline(`${this.n} --help`)}`)

      Deno.exit(1)
    }

    if (typeof command === 'string')
      command = this.c.get(command) as Command
    
    try {
      await command.action({ version: Deno.env.get('__drgn-version') ?? 'v0.0.0', ...args })

      Deno.exit()
    } catch (err) {
      if (err instanceof Error)
        await error(err.message)

      Deno.exit(1)
    }
  }

  private async executeOption(args: ParsedArgs) {
    let option = this.o.get(Object.keys(args).filter(key => key !== '_')[0])

    if (!option) {
      await error(`option not found. try ${underline(`${this.n} --help`)}`)

      Deno.exit(1)
    }

    if (typeof option === 'string')
      option = this.o.get(option) as Option

    try {
      await option.action({ version: Deno.env.get('__drgn-version') ?? 'v0.0.0', ...args })

      Deno.exit()
    } catch (err) {
      if (err instanceof Error)
        await error(err.message)

      Deno.exit(1)
    }
  }

  private async printHelp() {
    let text = `${bold(this.n ?? '')} ${Deno.env.get('__drgn-version') ?? 'v0.0.0'}`

    text += `\n\n\n${underline(white('USAGE'))}\n\n`
    text += `${white('devyl')} [COMMAND/OPTION] \n`

    text += `\n\n${underline(white('OPTIONS'))}\n\n`

    text += `${white('--help, -h')} | Print this menu.\n`
    text += `${white('--version, -v')} | Print the current version.\n`

    for (const option of this.o.values())
      if (typeof option !== 'string')
        text += `${white(`--${option.name}`)}${option.alias ? `, ${white(`-${option.alias}`)}` : ''} | ${option.description}\n`

    if (this.c.size > 0) {
      text += `\n\n${underline(white('COMMANDS'))}\n\n`

      for (const command of this.c.values())
        if (typeof command !== 'string')
          text += `${white(command.name)}${command.alias ? `, ${white(command.alias)}` : ''} | ${command.description}\n`
    }

    await log(gray(text))

    Deno.exit()
  }

  private async printVersion() {
    const url = Deno.env.get('__drgn-url')

    if (!url)
      Deno.exit(1)

    const item = localStorage.getItem(atob(url))

    if (!item)
      Deno.exit(1)

    await log(gray(`${bold(this.n ?? '')} ${item.split(':')[0]}\n\n${italic(`Checked for updates ${ms(Date.now() - Number(item.split(':')[1]), { long: true })} ago.`)}`))

    Deno.exit()
  }

  name(name: string) {
    this.n = name

    return this
  }

  command(command: Command) {
    this.c.set(command.name, command)

    if (command.alias)
      this.c.set(command.alias, command.name)

    return this
  }

  option(option: Option) {
    this.o.set(option.name, option)

    if (option.alias)
      this.o.set(option.alias, option.name)

    return this
  }

  async run() {
    const args = parse(Deno.args)

    if (args._.length > 0 && typeof args._[0] === 'string')
      await this.executeCommand(args)
    else if (args.version || args.v)
      await this.printVersion()
    else if (args.help || args.h)
      await this.printHelp()
    else
      await this.executeOption(args)
  }
}
