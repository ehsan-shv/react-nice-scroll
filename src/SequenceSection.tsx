import React, { FC, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { preloadImages, calcDrawImage } from './utils';
import { useGlobalState } from './state';

interface SequenceSectionProps {
  imagesPath: string;
  imagesType: string;
  imagesCount: number;
  start?: string;
  end?: string;
}

export const SequenceSection: FC<SequenceSectionProps> = ({
  imagesPath,
  imagesType,
  imagesCount,
  start = 'top top',
  end = '200%',
  ...props
}) => {
  const sequenceSection = useRef<HTMLDivElement | null>(null);
  const sequenceSectionCanvas = useRef<HTMLCanvasElement | null>(null);
  const [scroller] = useGlobalState('container');

  useLayoutEffect(() => {
    const urls = [];
    for (let i = 0; i < imagesCount; i++) {
      urls.push(`${imagesPath}/${i + 1}.${imagesType}`);
    }

    const images = preloadImages(urls);

    let ctx: CanvasRenderingContext2D | null;
    if (sequenceSectionCanvas.current) {
      ctx = sequenceSectionCanvas.current.getContext('2d');
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sequenceSection.current,
        scroller,
        scrub: true,
        start,
        end,
        pin: true,
        pinType: scroller === document.body ? 'fixed' : 'transform',
        onEnter: () => {
          if (sequenceSection.current) sequenceSection.current.style.willChange = 'transform';
        },
        onEnterBack: () => {
          if (sequenceSection.current) sequenceSection.current.style.willChange = 'transform';
        },
        onLeave: () => {
          if (sequenceSection.current) sequenceSection.current.style.willChange = '';
        },
        onLeaveBack: () => {
          if (sequenceSection.current) sequenceSection.current.style.willChange = '';
        },
      },
    });

    window.addEventListener(
      'resize',
      (function resize() {
        ctx!.canvas.width = document.documentElement.clientWidth;
        ctx!.canvas.height = document.documentElement.clientHeight;
        return resize;
      })()
    );

    images.then((imgs) => {
      const counter = { i: 0 };

      tl.to(
        counter,
        {
          i: imgs.length - 1,
          roundProps: 'i',
          ease: 'none',
          immediateRender: true,
          onUpdate: () => {
            if (ctx) calcDrawImage(ctx, imgs[counter.i]);
          },
        },
        0
      );

      window.addEventListener('resize', () => {
        if (ctx) calcDrawImage(ctx, imgs[counter.i]);
      });
    });

    return () => {
      tl?.kill();
    };
  }, [end, imagesCount, imagesPath, imagesType, scroller, start]);

  return (
    <section className="ns-sequence-section" ref={sequenceSection} {...props}>
      <canvas className="ns-sequence-section__canvas" ref={sequenceSectionCanvas} />
    </section>
  );
};
