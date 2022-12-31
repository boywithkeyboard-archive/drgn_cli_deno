## drgn

### Usage

```ts
import drgn, { Command } from 'https://deno.gg/drgn@v0.1.0'

const cli = new drgn()
  .command('build', new Command(), {
    // some options
  })

if (import.meta.main)
  cli()
```
