import { parse } from 'https://deno.land/std@v0.182.0/flags/mod.ts'

if (import.meta.main) {
  const args = parse(Deno.args)

  , url = (args.u ?? args.url) as string
  , id = Date.now().toString()

  await Deno.run({
    cmd: ['deno', 'install', '-q', '-n', args.n ?? args.name, '-f', '--location', `https://drgn.azury.dev/${args.n ?? args.name}_${id}`, '-A', `https://drgn.azury.dev/run?version=v0.9.0&name=${url.split('/')[0].split('@')[0]}&url=${btoa(`https://deno.land/x/${url}`)}&location=${args.n ?? args.name}_${id}&canary=${args.canary !== undefined}`]
  }).status()

  Deno.exit()
}
