import type { ParsedArgs } from './ParsedArgs.d.ts'

export class Option {
  public name
  public alias
  public description
  public action

  constructor(options: { name: string, alias?: string, description: string }, action: (args: ParsedArgs) => Promise<void> | void) {
    this.name = options.name
    this.alias = options.alias
    this.description = options.description
    this.action = action
  }
}
