<div align='center'>
  <img src='https://raw.githubusercontent.com/azurystudio/drgn/dev/.github/drgn.svg' width='64px' />
  <h1>drgn</h1>
</div>

<br>
<br>

A full-stack CLI library for deploying and managing enterprise-grade command line applications.

### Usage

#### Create a simple CLI

```ts
import drgn, { Command, Option } from 'https://deno.land/x/drgn@v0.10.2/mod.ts'

const sayCommand = new Command({
  name: 'say',
  alias: 's',
  description: 'Say something to me.',
  usage: 'say <sentence>'
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

deno run -A -q https://deno.land/x/drgn@v0.10.2/installer.js -n mycli -u mycli@$version/cli/mod.ts

# optionally, if you want to allow canary releases:
deno run -A -q https://deno.land/x/drgn@v0.10.2/installer.js -n mycli -u mycli@$version/cli/mod.ts --canary
```
