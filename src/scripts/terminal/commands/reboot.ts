import { register } from '../core';

// Easter egg: replays the first-visit boot log (015) on the current page, or prints it under reduced motion.
register({
  name: 'reboot',
  hidden: true,
  async run(_, ctx) {
    if (ctx.reducedMotion) {
      document.querySelectorAll('.boot li').forEach((li) => ctx.print(li.textContent ?? ''));
      return;
    }
    ctx.close();
    (await import('@/scripts/boot')).play();
  },
});
