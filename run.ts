if (import.meta.main) {
  const fetchVersion = async (): Promise<string | undefined> => {
    try {
      const res = await fetch('https://apiland.deno.dev/v2/modules/$name')
  
      if (res.ok) {
        const json = await res.json()
  
        return json.latest_version
      }
    // deno-lint-ignore no-empty
    } catch (_err) {}
  }

  const item = localStorage.getItem('$url')

  if (item && (Date.now() - Number(item.split(':')[1]) >= 1800000)) { // refetch every 30 minutes
    Deno.run({ cmd: ['deno', 'eval', '--location', 'https://azury.dev/drgn_$location', `
      try {
        const res = await fetch('https://apiland.deno.dev/v2/modules/$name')

        if (res.ok) {
          const json = await res.json()

          localStorage.setItem('$url', json.latest_version + ':' + Date.now().toString())
        }
      } catch (_err) {}
    `] })

    Deno.env.set('__drgn-last_checked', item.split(':')[1])
    Deno.env.set('__drgn-url', btoa('$url'))
    Deno.env.set('__drgn-location', btoa('https://azury.dev/drgn_$location'))
    Deno.env.set('__drgn-version', item.split(':')[0])
    
    const mod = await import('$url'.replace('$version', item.split(':')[0]))

    mod.default()
  } else if (item) {
    Deno.env.set('__drgn-last_checked', item.split(':')[1])
    Deno.env.set('__drgn-url', btoa('$url'))
    Deno.env.set('__drgn-location', btoa('https://azury.dev/drgn_$location'))
    Deno.env.set('__drgn-version', item.split(':')[0])

    const mod = await import('$url'.replace('$version', item.split(':')[0]))

    mod.default()
  } else {
    const version = await fetchVersion()

    if (!version)
      throw new Error('cannot fetch version')

    const time = Date.now()

    localStorage.setItem('$url', `${version}:${time}`)

    Deno.env.set('__drgn-last_checked', time.toString())
    Deno.env.set('__drgn-url', btoa('$url'))
    Deno.env.set('__drgn-location', btoa('https://azury.dev/drgn_$location'))
    Deno.env.set('__drgn-version', version)

    const mod = await import('$url'.replace('$version', version))

    mod.default()
  }
}
