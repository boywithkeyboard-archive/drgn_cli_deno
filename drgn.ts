import { run } from './run.ts'
import { Command, Config } from './types.ts'

export class drgn {
  #config
  #commands: [string, Command][]

  constructor(config: Config) {
    this.#config = config
    this.#commands = []
  }

  // deno-lint-ignore no-explicit-any
  command(name: string, command: Command<any>) {
    this.#commands.push([name, command])

    return this
  }

  run() {
    return run(this.#config, this.#commands)
  }
}
