## drgn

### Usage

1. **Configure drgn.**

   `./drgn.ts`
   ```ts
   import drgn from 'https://deno.land/x/drgn@v0.11.0/mod.ts'

   export default <drgn.config> {
     name: 'greeter',
     version: '0.1.0', // current version
     autoUpdate: { // optional, can also be a function
       registry: 'deno.land',
       moduleName: 'greeter',
     },
   }
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

3. **Build it.**

   ```bash
   deno run -A https://deno.land/x/drgn@v0.11.0/build.ts
   ```

4. **Run it.**

   ```bash
   deno run ./out/cli.js greet --name Tom # Hey, Tom!
   ```
