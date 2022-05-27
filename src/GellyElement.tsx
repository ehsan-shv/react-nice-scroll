import React, { FC, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGlobalState } from './state';
import { gellyAnimation } from './animations';
gsap.registerPlugin(ScrollTrigger);

interface GellyElementProps {
  children: React.ReactNode;
  trigger?: gsap.DOMTarget | string;
  axis?: 'skewY' | 'skewX';
  intensity?: number;
  min?: number;
  max?: number;
  duration?: number;
  ease?: string;
  start?: string;
  end?: string;
}

export const GellyElement: FC<GellyElementProps> = ({
  children,
  axis = 'skewY',
  trigger,
  intensity = -400,
  min = -40,
  max = 40,
  duration = 0.3,
  ease = 'expo.out',
  start = 'top bottom',
  end = 'bottom top',
  ...props
}) => {
  const gellyElement = useRef<null | HTMLDivElement>(null);
  const [scroller] = useGlobalState('container');

  useLayoutEffect(() => {
    let animation: gsap.core.Tween | undefined;
    const scrollTrigger = ScrollTrigger.create({
      trigger: trigger || gellyElement.current,
      scroller,
      start,
      end,
      onUpdate: self => {
        if (gellyElement.current)
          animation = gellyAnimation(
            gellyElement.current,
            self.getVelocity(),
            axis,
            intensity,
            min,
            max,
            duration,
            ease
          );
      },
    });

    return () => {
      animation?.kill();
      scrollTrigger?.kill();
    };
  }, [
    axis,
    duration,
    ease,
    end,
    intensity,
    max,
    min,
    scroller,
    start,
    trigger,
  ]);
  return (
    <div className="ns-gelly-element" ref={gellyElement} {...props}>
      {children}
    </div>
  );
};
