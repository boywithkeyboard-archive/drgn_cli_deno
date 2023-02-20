## drgn

A full-stack CLI library for deploying and managing enterprise-grade command line applications.

### Usage

#### Create a simple CLI

```ts
import drgn, { Command, Option } from 'https://deno.gg/drgn@v0.9.0'

const sayCommand = new Command({
  name: 'say',
  alias: 's',
  description: 'Say something to me.'
}, ({ _ }) => {
  console.log(_[1]) // mycli say hello -> 'hello'
})

export default new drgn()
  .name('mycli')
  .command(sayCommand)
```

#### Install your CLI (for autoupdates)

```bash
# -n: the name under which your cli should be installed
# -u: the url to your script - MUST be hosted on deno.land, e.g. https://deno.land/x/mycli/$version/cli/mod.ts

deno run -A -q https://deno.land/x/drgn@v0.9.0/installer.js -n mycli -u mycli@$version/cli/mod.ts
```
