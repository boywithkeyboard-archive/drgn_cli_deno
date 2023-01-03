## drgn

### Usage

```ts
import drgn, { Command, Option } from 'https://deno.gg/drgn@v0.2.0'

const greetingCommand = new Command({
  name: 'greet',
  alias: 'hello',
  description: 'A greeting command.'
}, ({ name }) => {
  console.log(name ? `hey ${name}!` : 'hey there!')
})

const aboutOption = new Option({
  name: 'about',
  description: 'About the CLI.'
}, () => {
  console.log('Awesome')
})

const cli = new drgn()
  .name('example')
  .version('v1.2.3')
  .command(greetingCommand)
  .option(aboutOption)
  .run

if (import.meta.main)
  cli()
```
