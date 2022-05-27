import React, { FC, useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGlobalState } from './state';
import { parallaxAnimation } from './animations';

interface ParallaxImageProps {
  src: string;
  alt?: string;
  triggerElement?: gsap.DOMTarget | string;
  start?: string;
  end?: string;
  axis?: 'y' | 'x';
  fromPercent?: number;
  toPercent?: number;
  containerHeight?: string;
  imageScale?: number;
  imageObjectPosition?: string;
}

export const ParallaxImage: FC<ParallaxImageProps> = ({
  src,
  alt,
  triggerElement,
  start = 'top bottom',
  end = 'bottom top',
  axis = 'y',
  fromPercent = -40,
  toPercent = 40,
  containerHeight = '100vh',
  imageScale = 1.2,
  imageObjectPosition = 'center',
  ...props
}) => {
  const parallaxImage = useRef<HTMLElement | null>(null);
  const parallaxImageInner = useRef<HTMLImageElement | null>(null);

  const [scroller] = useGlobalState('container');

  useLayoutEffect(() => {
    const trigger = parallaxImage.current || triggerElement;
    let animation: gsap.core.Timeline;

    if (parallaxImageInner.current !== null && trigger && scroller) {
      animation = parallaxAnimation(
        parallaxImageInner.current,
        trigger,
        scroller,
        start,
        end,
        axis,
        fromPercent,
        toPercent
      );
    }

    return () => {
      animation?.kill();
    };
  }, [
    axis,
    end,
    fromPercent,
    scroller,
    start,
    toPercent,
    triggerElement,
    containerHeight,
    imageScale,
    imageObjectPosition,
  ]);

  return (
    <figure
      className="ns-parallax-image"
      ref={parallaxImage}
      style={{ height: `${containerHeight}` }}
      {...props}
    >
      <img
        ref={parallaxImageInner}
        src={src}
        alt={alt}
        className="ns-parallax-image__inner"
        style={{
          transform: `scale(${imageScale})`,
          objectPosition: `${imageObjectPosition}`,
        }}
        loading="lazy"
        onLoad={() => ScrollTrigger.refresh()}
      />
    </figure>
  );
};
