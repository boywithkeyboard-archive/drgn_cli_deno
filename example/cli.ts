import drgn from '../mod.ts'
import greet from './commands/greet.ts'

new drgn({
  name: 'greeter',
})
  .command('greet', greet)
  .run()
