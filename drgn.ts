import { ZodType } from 'https://deno.land/x/zod@v3.22.2/mod.ts'

// deno-lint-ignore no-namespace
export namespace drgn {
  export type config = {
    name: string
    version?: string
    autoUpdate?:
      | {
        registry: 'deno.land'
        moduleName: string
      }
      | (() => Promise<string> | string)
  }

  export type context<
    Args extends Record<string, drgn.argSchema>,
  > = {
    raw: {
      [x: string]: unknown
      _: (string | number)[]
    }
    arg: <T extends keyof Args>(name: T) => Args[T]
  }

  export type argSchema = {
    alias?: string | string[]
    description?: string
    schema: ZodType
  }

  export type command<Args extends Record<string, drgn.argSchema>> = {
    description?: string
    args?: Args
    handler: (ctx: drgn.context<Args>) => Promise<void> | void
  }
}
