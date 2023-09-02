import { parse } from 'https://deno.land/std@0.201.0/flags/mod.ts'
import { z, ZodType } from 'https://deno.land/x/zod@v3.22.2/mod.ts'

export type Config = {
  name: string
  version?: string
  checkUpdate?:
    | {
      registry: 'deno.land'
      moduleName: string
    }
    | (() => Promise<string> | string)
}

export type Context<
  Args extends Record<string, ArgSchema>,
> = {
  args: ReturnType<typeof parse>
  arg: <T extends keyof Args>(name: T) => z.infer<Args[T]['schema']>
}

export type ArgSchema = {
  alias?: string | string[]
  description?: string
  schema: ZodType
}

export type Command<
  Args extends Record<string, ArgSchema> = Record<
    string,
    ArgSchema
  >,
> = {
  description?: string
  args?: Args
  handler: (ctx: Context<Args>) => Promise<void> | void
}
