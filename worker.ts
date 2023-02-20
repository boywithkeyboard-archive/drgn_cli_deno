async function getModule(name: string, context: any, cache: Cache): Promise<Record<string, unknown> | undefined> {
  try {
    const moduleUrl = new URL('https://drgn.azury.dev/deno/modules/' + name)

    const cachedResponse = await cache.match(moduleUrl)

    if (cachedResponse)
      return await cachedResponse.json()

    const res = await fetch('https://apiland.deno.dev/v2/modules/' + name)
      
    if (res.ok) {
      const json = await res.json()

      const transformedResponse = new Response(JSON.stringify(json), {
        headers: {
          'content-type': 'application/json; charset=utf-8;',
          'cache-control': `public, max-age=${15 * 60}` // 15 minutes
        }
      })

      context.waitUntil(cache.put(moduleUrl, transformedResponse))
      
      return json
    }
  } catch (_err) {
    return undefined
  }
}

export default {
  async fetch(request: Request, _env: unknown, context: any) {
    if (request.method !== 'GET')
      return new Response('Not Found', {
        status: 404,
        headers: {
          'content-type': 'text/plain; charset=utf-8;'
        }
      })

    const cache = await caches.open('drgn')

    const cachedResponse = await cache.match(request)
    
    if (cachedResponse)
      return cachedResponse

    const url = new URL(request.url)

    const query = Object.fromEntries(url.searchParams)

    if (url.pathname === '/run') {
      if (!query.version || !query.name || !query.url || !query.location)
        return new Response(null, { status: 400 })

      const res = await fetch(`https://deno.land/x/drgn@${query.version}/run.ts`)

      if (!res.ok)
        return new Response(null, { status: 400 })

      const runScript = (await res.text())
        .replaceAll('$name', query.name)
        .replaceAll('$url', atob(query.url))
        .replaceAll('$location', query.location)

      const response = new Response(runScript, {
        headers: {
          'content-type': 'application/x-typescript; charset=utf-8;',
          'cache-control': `public, max-age=${365*86400}` // 365 days
        }
      })

      if (response.ok)
        context.waitUntil(cache.put(request, response.clone()))

      return response
    } else if (url.pathname === '/install') {
      if (!query.name || !query.url)
        return new Response(null, { status: 400 })

      const res = await fetch('https://deno.land/x/drgn@v0.9.0/custom_installer.js')

      if (!res.ok)
        return new Response(null, { status: 400 })

      const installScript = (await res.text())
        .replaceAll('$name', query.name)
        .replaceAll('$url', query.url)
        .replaceAll('$id', Date.now().toString())

      const response = new Response(installScript, {
        headers: {
          'content-type': 'application/javascript; charset=utf-8;',
          'cache-control': `public, max-age=${365*86400}` // 365 days
        }
      })

      if (response.ok)
        context.waitUntil(cache.put(request, response.clone()))

      return response
    } else {
      const pathname = url.pathname.replace('/', '')

      if (pathname.includes('/'))
        return new Response(null, { status: 500 })

      const module = await getModule(pathname, context, cache)

      if (!module)
        return new Response(null, {
          status: 500
        })

      return new Response(module.latest_version as string, {
        headers: {
          'content-type': 'text/plain; charset=utf-8;'
        }
      })
    }
  }
}
