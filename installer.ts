import { parse } from 'https://deno.land/std@v0.175.0/flags/mod.ts'

if (import.meta.main) {
  const args = parse(Deno.args)

  const url = (args.u ?? args.url) as string

  await Deno.run({
    cmd: ['deno', 'install', '-q', '-n', args.n ?? args.name, '-f', '--location', `https://azury.dev/drgn_${args.n ?? args.name}`, '-A', `https://drgn.azury.dev/run?version=v0.5.2&name=${url.split('/')[0].split('@')[0]}&url=${btoa(`https://deno.land/x/${url}`)}&location=${args.n ?? args.name}`]
  }).status()

  Deno.exit()
}
