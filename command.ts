import { ArgSchema, Command } from './types.ts'

export function command<
  Args extends Record<string, ArgSchema> = Record<string, never>,
>(
  handler: Command<Args>['handler'],
): Command<Args>

export function command<
  Args extends Record<string, ArgSchema> = Record<string, never>,
>(
  args: Args,
  handler: Command<Args>['handler'],
): Command<Args>

export function command<
  Args extends Record<string, ArgSchema> = Record<string, never>,
>(
  description: string,
  handler: Command<Args>['handler'],
): Command<Args>

export function command<
  Args extends Record<string, ArgSchema> = Record<string, never>,
>(
  description: string,
  args: Args,
  handler: Command<Args>['handler'],
): Command<Args>

export function command<
  Args extends Record<string, ArgSchema> = Record<string, never>,
>(
  ...args: Array<string | Args | Command<Args>['handler']>
): Command<Args> {
  return {
    description: args.filter((arg) => typeof arg === 'string')[0] as
      | string
      | undefined,
    args: args.filter((arg) =>
      typeof arg !== 'string' && typeof arg !== 'function'
    )[0] as Args | undefined,
    handler: args.filter((arg) => typeof arg === 'function')[0] as Command<
      Args
    >['handler'],
  }
}
