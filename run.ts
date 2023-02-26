if (import.meta.main) {
  const allowCanary = false

  const fetchVersion = async (): Promise<string | undefined> => {
    try {
      const res = await fetch(`https://drgn.azury.dev/$name?canary=${allowCanary}`)
  
      if (res.ok)
        return await res.text()
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
  
    typeof mod.default === 'function' ? await mod.default() : await mod.default.run()
  } else {
    Deno.env.set('__drgn-last_checked', item.split(':')[1])
    Deno.env.set('__drgn-url', btoa('$url'))
    Deno.env.set('__drgn-location', btoa('https://drgn.azury.dev/$location'))
    Deno.env.set('__drgn-version', item.split(':')[0])

    const mod = await import('$url'.replace('$version', item.split(':')[0]))

    typeof mod.default === 'function' ? await mod.default() : await mod.default.run()
  }
}
