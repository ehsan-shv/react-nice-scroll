// @ts-nocheck
const detectTouch = () => {
  if (typeof window !== 'undefined') {
    return Boolean(
      'ontouchstart' in window ||
        window.navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0 ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    );
  }
};

export default detectTouch;
