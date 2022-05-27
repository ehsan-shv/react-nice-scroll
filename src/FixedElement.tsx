import React, { FC, useLayoutEffect, useRef } from 'react';
import { useGlobalState } from './state';

interface FixedElementProps {
  children: React.ReactNode;
  top?: number;
  right?: number;
  left?: number;
}

export const FixedElement: FC<FixedElementProps> = ({
  children,
  top = 0,
  left,
  right,
  ...props
}) => {
  const fixedElement = useRef<HTMLDivElement | null>(null);
  const [smoothScrollBar] = useGlobalState('smoothScrollBar');

  useLayoutEffect(() => {
    if (smoothScrollBar)
      smoothScrollBar.addListener(({ offset }) => {
        if (fixedElement.current) {
          fixedElement.current.style.top = top + offset.y + 'px';
          if (right !== undefined)
            fixedElement.current.style.right = right + offset.x + 'px';
          if (left !== undefined)
            fixedElement.current.style.left = left + offset.x + 'px';
        }
      });
    return () => {};
  }, [left, right, smoothScrollBar, top]);
  return (
    <div
      className="ns-fixed-element"
      ref={fixedElement}
      style={{ top, left, right }}
      {...props}
    >
      {children}
    </div>
  );
};
