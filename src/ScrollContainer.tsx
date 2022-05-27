import React, { FC, useLayoutEffect, useRef } from 'react';
import SmoothScrollbar from 'smooth-scrollbar';
import AllowScrollPlugin from './allowScrollPlugin';
import WillChangePlugin from './willChangePlugin';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGlobalState } from './state';
import detectTouch from './isTouch';
import './styles.scss';

interface ScrollContainerProps {
  children: React.ReactNode;
  damping?: number;
  thumbMinSize?: number;
  renderByPixels?: boolean;
  alwaysShowTracks?: boolean;
  continuousScrolling?: boolean;
  delegateTo?: EventTarget;
  activeSmoothScrollOnTouchDevice?: boolean;
  disableSmoothScroll?: boolean;
}

export const ScrollContainer: FC<ScrollContainerProps> = ({
  children,
  damping = 0.075,
  thumbMinSize = 20,
  renderByPixels = false,
  alwaysShowTracks = false,
  continuousScrolling = true,
  delegateTo,
  activeSmoothScrollOnTouchDevice = false,
  disableSmoothScroll = false,
  ...props
}) => {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  // @ts-ignore: Unreachable code error
  const [_container, setContainer] = useGlobalState('container');
  // @ts-ignore: Unreachable code error
  const [_scrollBar, setScrollBar] = useGlobalState('smoothScrollBar');

  useLayoutEffect(() => {
    if (
      (detectTouch() && !activeSmoothScrollOnTouchDevice) ||
      disableSmoothScroll
    ) {
      if (scrollContainer.current) {
        scrollContainer.current.style.overflow = 'auto';
        scrollContainer.current.style.height = 'auto';
        setContainer(document.body);
      }
      return;
    }

    SmoothScrollbar.use(AllowScrollPlugin, WillChangePlugin);
    const view = scrollContainer.current;
    if (view) {
      const smoothScroll = SmoothScrollbar.init(view, {
        damping,
        thumbMinSize,
        renderByPixels,
        alwaysShowTracks,
        continuousScrolling,
        delegateTo,
      });
      if (smoothScroll) setScrollBar(smoothScroll);

      ScrollTrigger.scrollerProxy(view, {
        scrollTop(value) {
          if (arguments.length && value) {
            smoothScroll.scrollTop = value;
          }
          return smoothScroll.scrollTop;
        },
      });

      smoothScroll.addListener(ScrollTrigger.update);

      if (scrollContainer.current) setContainer(scrollContainer.current);
    }

    return () => {
      SmoothScrollbar?.destroyAll();
    };
  }, [
    alwaysShowTracks,
    continuousScrolling,
    damping,
    renderByPixels,
    thumbMinSize,
    setContainer,
    activeSmoothScrollOnTouchDevice,
    disableSmoothScroll,
    delegateTo,
    setScrollBar,
  ]);

  return (
    <div className="ns-container" {...props} ref={scrollContainer}>
      {children}
    </div>
  );
};
