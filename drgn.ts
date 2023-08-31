import { run } from './run.ts'
import { Command, Config } from './types.ts'

export class drgn {
  #config
  #commands

  constructor(config: Config) {
    this.#config = config
    this.#commands = new Map<string, Command>()
  }

  // deno-lint-ignore no-explicit-any
  command(name: string, command: Command<any>) {
    this.#commands.set(name, command)

    return this
  }

  run() {
    return run(this.#config, this.#commands)
  }
}
