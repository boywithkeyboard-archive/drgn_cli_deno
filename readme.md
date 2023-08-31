## drgn

### Usage

1. **Configure drgn.**

   `./mod.ts`
   ```ts
   import drgn from 'https://deno.land/x/drgn@v0.11.0/mod.ts'
   import greet from './commands/greet.ts'

   new drgn({
     name: 'greeter',
     version: '0.1.0', // current version
     checkUpdate: { // optional, can also be a function
       registry: 'deno.land',
       moduleName: 'greeter',
     },
   })
     .command('greet', greet)
     .run()
   ```

2. **Create a command.**

   `./commands/greet.ts`
   ```ts
   import { command, z } from 'https://deno.land/x/drgn@v0.11.0/mod.ts'

   export default command('Greet somebody.', {
     name: {
       alias: 'n',
       schema: z.string().min(1).max(32),
     },
   }, (ctx) => {
     console.log(`Hey, ${ctx.arg('name')}!`)
   })
   ```

3. **Run it.**

   ```bash
   deno run ./mod.ts greet --name Tom # Hey, Tom!
   ```
