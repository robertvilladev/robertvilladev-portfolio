// All scroll motion lives here. Content is visible by default; GSAP only hides
// things it is about to animate, and only when the user allows motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const lenis = new Lenis({ anchors: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  dive();
  reveals();
  zoomOpen();
  timelineGrow();
  parallax();

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});

/** Hero: pin, push the camera into the terminal, break the screen into pixels, clear. */
function dive() {
  const hero = document.querySelector<HTMLElement>('[data-dive]');
  if (!hero) return;
  const screen = hero.querySelector('[data-dive-target]');
  const cells = hero.querySelectorAll('[data-dive-cell]');

  gsap
    .timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=130%', scrub: 0.6, pin: true, anticipatePin: 1 },
      defaults: { ease: 'none' },
    })
    .to(hero.querySelectorAll('[data-dive-fade]'), { autoAlpha: 0, duration: 0.2 }, 0)
    .to(screen, { scale: () => (innerWidth < 768 ? 1.8 : 2.8), ease: 'power2.in', duration: 1 }, 0)
    .to(cells, { opacity: 1, duration: 0.25, stagger: { amount: 0.45, from: 'random' } }, 0.55)
    .set(screen, { autoAlpha: 0 })
    .to(cells, { opacity: 0, duration: 0.25, stagger: { amount: 0.45, from: 'random' } });
}

function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/** Project windows open from a small centred rectangle, staggered per row. The view-transition morph target (#p-<slug>, see Base.astro) is already on screen. */
function zoomOpen() {
  const els = gsap.utils.toArray<HTMLElement>('[data-zoom]').filter((el) => el.id !== `p-${document.documentElement.dataset.vt}`);
  if (!els.length) return;
  gsap.set(els, { autoAlpha: 0, scale: 0.85, clipPath: 'inset(35% 35% 35% 35%)' });
  ScrollTrigger.batch(els, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
        clearProps: 'clipPath,transform',
      }),
  });
}

function timelineGrow() {
  gsap.utils.toArray<HTMLElement>('[data-grow]').forEach((el) => {
    gsap.from(el, { scaleY: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 60%', scrub: true } });
  });
}

function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) * innerHeight;
    gsap.fromTo(el, { y: amount }, { y: -amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
