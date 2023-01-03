import { brightBlue, brightGreen, brightRed, yellow, gray } from 'https://deno.land/std@v0.170.0/fmt/colors.ts'

const write = async (message: string) => {
  await Deno.stdout.write(new TextEncoder().encode(`\r\x1b[K${message}`))
}

export const success = async (message: string, prefix?: string) => await write(`${brightGreen(prefix ?? 'success')} ${gray(`- ${message}`)}`)
export const error = async (message: string, prefix?: string) => await write(`${brightRed(prefix ?? 'error')} ${gray(`- ${message}`)}`)
export const info = async (message: string, prefix?: string) => await write(`${brightBlue(prefix ?? 'info')} ${gray(`- ${message}`)}`)
export const warn = async (message: string, prefix?: string) => await write(`${yellow(prefix ?? 'warning')} ${gray(`- ${message}`)}`)
