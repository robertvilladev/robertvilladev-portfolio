// Single source for personal/site data. Links left `null` are not rendered.
export const site = {
  name: 'Robert Villa',
  handle: 'rv@dev',
  location: 'Barcelona',
  stack: 'typescript · python · react · angular · vue · node · fastapi · django · gsap',
  github: 'https://github.com/robertvilladev',
  linkedin: 'https://www.linkedin.com/in/robertvillalopez/',
  email: 'stamek.ts@gmail.com' as string | null,
  cvUrl: null as string | null, // TODO: drop cv.pdf in /public and set '/cv.pdf'
};
