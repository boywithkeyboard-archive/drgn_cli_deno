import type { ParsedArgs } from './ParsedArgs.d.ts'

export class Option {
  public name
  public description
  public action

  constructor(name: string, description: string, action: (args: ParsedArgs) => Promise<void> | void) {
    this.name = name
    this.description = description
    this.action = action
  }
}
