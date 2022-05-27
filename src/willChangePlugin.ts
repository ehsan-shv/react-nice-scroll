import Scrollbar from 'smooth-scrollbar';

class WillChangePlugin extends Scrollbar.ScrollbarPlugin {
  transformDelta(delta: any, _evt: any) {
    this.scrollbar.contentEl.style.willChange = 'transform';

    return delta;
  }

  onRender(remainMomentum: { x: number; y: number }) {
    if (remainMomentum.x === 0 && remainMomentum.y === 0) {
      this.scrollbar.contentEl.style.willChange = '';
    }
  }
}

WillChangePlugin.pluginName = 'willChange';

export default WillChangePlugin;
