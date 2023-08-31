import { command, z } from '../../mod.ts'

export default command('Greet somebody.', {
  name: {
    alias: 'n',
    schema: z.string().min(1).max(32),
  },
}, (ctx) => {
  console.log(`Hey, ${ctx.arg('name')}!`)
})
