import { parse } from 'https://deno.land/std@v0.175.0/flags/mod.ts'

if (import.meta.main) {
  const args = parse(Deno.args)

  const url = (args.u ?? args.url) as string

  const runScript = (await (await fetch('https://deno.land/x/drgn@v0.5.0/run.ts')).text())
    .replace('$name', url.split('/')[0].split('@')[0])
    .replace('$url', `https://deno.land/x/${url}`)
    .replace('$location', args.n ?? args.name)

  Deno.run({
    cmd: ['deno', 'install', '-n', args.n ?? args.name, '-f', '--location', `https://azury.dev/drgn_${args.n ?? args.name}`, '-A', `https://drgn.azury.dev/v0.5.0/${btoa(runScript)}`]
  })
}
