import React, { FC, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGlobalState } from './state';

interface HorizontalSectionProps {
  children: React.ReactNode;
  toRight?: boolean;
  start?: string;
  addAnimation?: (fromTo: gsap.core.Tween) => void;
}

export const HorizontalSection: FC<HorizontalSectionProps> = ({
  children,
  toRight = true,
  start = 'top top',
  addAnimation,
  ...props
}) => {
  const horizontal = useRef<null | HTMLDivElement>(null);
  const pinWrap = useRef<null | HTMLDivElement>(null);
  const animationWrap = useRef<null | HTMLDivElement>(null);
  const [scroller] = useGlobalState('container');

  useLayoutEffect(() => {
    let fromTo: gsap.core.Tween;
    if (animationWrap.current) {
      const scrollWidth = animationWrap.current.scrollWidth;
      const getToValue = () => -(scrollWidth - window.innerWidth);

      fromTo = gsap.fromTo(
        animationWrap.current,
        {
          x: () => (toRight ? 0 : getToValue()),
        },
        {
          x: () => (toRight ? getToValue() : 0),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontal.current,
            scroller,
            pinType: scroller === document.body ? 'fixed' : 'transform',
            start,
            end: () => '+=' + scrollWidth,
            onEnter: () => {
              if (horizontal.current) horizontal.current.style.willChange = 'transform';
            },
            onEnterBack: () => {
              if (horizontal.current) horizontal.current.style.willChange = 'transform';
            },
            onLeave: () => {
              if (horizontal.current) horizontal.current.style.willChange = '';
            },
            onLeaveBack: () => {
              if (horizontal.current) horizontal.current.style.willChange = '';
            },
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            scrub: true,
          },
        }
      );

      if (addAnimation && fromTo) addAnimation(fromTo);
    }
    return () => {
      fromTo?.kill();
    };
  }, [addAnimation, toRight, scroller, start]);

  return (
    <section className="ns-horizontal-section" ref={horizontal} {...props}>
      <div className="ns-horizontal-section__pin-wrap" ref={pinWrap}>
        <div className="ns-horizontal-section__animation-wrap" ref={animationWrap}>
          {children}
        </div>
      </div>
    </section>
  );
};
