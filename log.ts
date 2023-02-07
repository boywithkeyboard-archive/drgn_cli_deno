import { brightBlue, brightGreen, brightRed, gray, brightYellow } from 'https://deno.land/std@v0.177.0/fmt/colors.ts'

const log = async (message: string, options?: { clear: boolean }) => {
  if (options?.clear)
    message = `\r\x1b[K${message}`

  await Deno.stdout.write(new TextEncoder().encode(message))
}

export const success = async (message: string, options?: { clear: boolean }) => (
  await log(`${brightGreen('success')} ${gray(`- ${message}`)}`, options)
)

export const error = async (message: string, options?: { clear: boolean }) => (
  await log(`${brightRed('error')} ${gray(`- ${message}`)}`, options)
)

export const info = async (message: string, options?: { clear: boolean }) => (
  await log(`${brightBlue('info')} ${gray(`- ${message}`)}`, options)
)

export const warn = async (message: string, options?: { clear: boolean }) => (
  await log(`${brightYellow('warning')} ${gray(`- ${message}`)}`, options)
)

export default log
