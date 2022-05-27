import { gsap } from 'gsap';

export const gellyAnimation = (
  element: HTMLDivElement | string,
  velocity: number,
  axis: 'skewY' | 'skewX',
  intensity: number,
  min: number,
  max: number,
  duration: number,
  ease: string
) => {
  let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(element, axis, 'deg'),
    clamp = gsap.utils.clamp(min, max);

  let skew = clamp(velocity / intensity);

  if (Math.abs(skew) > Math.abs(proxy.skew)) {
    proxy.skew = skew;
  }
  return gsap.to(proxy, {
    skew: 0,
    duration,
    ease,
    overwrite: true,
    onUpdate: () => skewSetter(proxy.skew),
    immediateRender: false,
  });
};

export const parallaxAnimation = (
  element: HTMLElement | string,
  trigger: gsap.DOMTarget | string,
  scroller: HTMLElement | HTMLDivElement,
  start: string,
  end: string,
  axis: 'y' | 'x',
  fromPercent: number,
  toPercent: number,
  containerAnimation?: gsap.core.Animation
) => {
  return gsap
    .timeline({
      scrollTrigger: {
        trigger,
        scroller,
        scrub: true,
        start,
        end,
        pin: false,
        containerAnimation,
      },
    })
    .from(element, {
      yPercent: axis === 'y' ? fromPercent : undefined,
      xPercent: axis === 'x' ? fromPercent : undefined,
      ease: 'none',
      immediateRender: scroller === document.body,
    })
    .to(element, {
      yPercent: axis === 'y' ? toPercent : undefined,
      xPercent: axis === 'x' ? toPercent : undefined,
      ease: 'none',
    });
};
