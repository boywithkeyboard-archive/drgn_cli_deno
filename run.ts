if (import.meta.main) {
  const fetchVersion = async (): Promise<string | undefined> => {
    try {
      const res = await fetch('https://drgn.azury.dev/$name')
  
      if (res.ok) {
        const json = await res.json()
  
        return json ? json.latest_version : ''
      }
    } catch (_err) {
      return undefined
    }
  }

  const item = localStorage.getItem('$url')

  if (!item || item && (Date.now() - Number(item.split(':')[1]) >= 5 * 60000)) { // refetch every 5 minutes
    const latestVersion = await fetchVersion()

    if (!latestVersion)
      throw new Error('cannot fetch version')

    const time = Date.now()

    localStorage.setItem('$url', `${latestVersion}:${time}`)
  
    Deno.env.set('__drgn-last_checked', time.toString())
    Deno.env.set('__drgn-url', btoa('$url'))
    Deno.env.set('__drgn-location', btoa('https://drgn.azury.dev/$location'))
    Deno.env.set('__drgn-version', latestVersion)
      
    const mod = await import('$url'.replace('$version', latestVersion))
  
    , exitCode = typeof mod.default === 'function' ? await mod.default() : await mod.run()
  
    Deno.exit(exitCode)
  } else {
    Deno.env.set('__drgn-last_checked', item.split(':')[1])
    Deno.env.set('__drgn-url', btoa('$url'))
    Deno.env.set('__drgn-location', btoa('https://drgn.azury.dev/$location'))
    Deno.env.set('__drgn-version', item.split(':')[0])

    const mod = await import('$url'.replace('$version', item.split(':')[0]))

    , exitCode = typeof mod.default === 'function' ? await mod.default() : await mod.run()

    Deno.exit(exitCode)
  }
}
