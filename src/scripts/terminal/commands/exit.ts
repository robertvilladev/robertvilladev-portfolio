import { register } from '../core';

register({ name: 'exit', man: 'term.man.exit', run: (_, ctx) => ctx.close() });
