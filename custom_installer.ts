import { parse } from 'https://deno.land/std@v0.178.0/flags/mod.ts'

if (import.meta.main) {
  const args = parse(Deno.args)

  await Deno.run({
    cmd: ['deno', 'install', '-q', '-n', '$name', '-f', '--location', `https://drgn.azury.dev/$name_$id`, '-A', `https://drgn.azury.dev/run?version=v0.9.0&name=${'$url'.split('/')[0].split('@')[0]}&url=${btoa(`https://deno.land/x/$url`)}&location=$name_$id&canary=${args.canary !== undefined}`]
  }).status()

  Deno.exit()
}
