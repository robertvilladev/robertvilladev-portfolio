import { register } from '../core';

register({ name: 'clear', man: 'term.man.clear', run: (_, ctx) => ctx.clear() });
