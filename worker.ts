export default {
  async fetch(request: Request, _env: unknown, context: any) {
    const cache = await caches.open('drgn')

    const cachedResponse = await cache.match(request)
    
    if (cachedResponse)
      return cachedResponse

    const url = new URL(request.url)

    const query = Object.fromEntries(url.searchParams)

    if (!query.version || !query.name || !query.url || !query.location)
      return new Response(null, { status: 400 })

    const res = await fetch(`https://deno.land/x/drgn@${query.version}/run.ts`)

    if (!res.ok)
      return new Response(null, { status: 400 })

    const runScript = (await res.text())
      .replace('$name', query.name)
      .replace('$url', `https://deno.land/x/${query.url}`)
      .replace('$location', query.location)

    const response = new Response(runScript, {
      headers: {
        'content-type': 'application/x-typescript; charset=utf-8;',
        'control-cache': `public, max-age=${365*86400}`
      }
    })

    if (response.ok)
      context.waitUntil(cache.put(request, response.clone()))

    return response
  }
}
