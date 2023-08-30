import { drgn } from './drgn.ts'

export function command<
  Args extends Record<string, drgn.argSchema> = Record<string, never>,
>(
  handler: drgn.command<Args>['handler'],
): drgn.command<Args>

export function command<
  Args extends Record<string, drgn.argSchema> = Record<string, never>,
>(
  args: Args,
  handler: drgn.command<Args>['handler'],
): drgn.command<Args>

export function command<
  Args extends Record<string, drgn.argSchema> = Record<string, never>,
>(
  description: string,
  handler: drgn.command<Args>['handler'],
): drgn.command<Args>

export function command<
  Args extends Record<string, drgn.argSchema> = Record<string, never>,
>(
  description: string,
  args: Args,
  handler: drgn.command<Args>['handler'],
): drgn.command<Args>

export function command<
  Args extends Record<string, drgn.argSchema> = Record<string, never>,
>(
  ...args: Array<string | Args | drgn.command<Args>['handler']>
): drgn.command<Args> {
  return {
    description: args.filter((arg) => typeof arg === 'string')[0] as
      | string
      | undefined,
    args: args.filter((arg) =>
      typeof arg !== 'string' && typeof arg !== 'function'
    )[0] as Args | undefined,
    handler: args.filter((arg) => typeof arg === 'function')[0] as drgn.command<
      Args
    >['handler'],
  }
}
