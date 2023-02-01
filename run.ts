if (import.meta.main) {
  const fetchVersion = async (): Promise<string | undefined> => {
    try {
      const res = await fetch('https://apiland.deno.dev/v2/modules/$name')
  
      if (res.ok) {
        const json = await res.json()
  
        return json.latest_version
      }
    } catch (_err) {}
  }

  const item = localStorage.getItem('$url')

  if (item && (Date.now() - Number(item.split(':')[1]) > 1800000/6)) { // refetch every 5 minutes
    Deno.run({ cmd: ['deno', 'eval', '--location', 'https://azury.dev/drgn_$location', `
      try {
        const res = await fetch('https://apiland.deno.dev/v2/modules/$name')

        if (res.ok) {
          const json = await res.json()

          localStorage.setItem('$url', json.latest_version + ':' + Date.now().toString())
        }
      } catch (_err) {}
    `] })
    
    const mod = await import('$url'.replace('$version', item.split(':')[0]))

    mod.default()
  } else if (item) {
    const mod = await import('$url'.replace('$version', item.split(':')[0]))

    mod.default()
  } else {
    const version = await fetchVersion()

    if (!version)
      throw new Error('cannot fetch version')

    localStorage.setItem('$url', `${version}:${Date.now()}`)

    const mod = await import('$url'.replace('$version', version))

    mod.default()
  }
}
