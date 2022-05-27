import Scrollbar from 'smooth-scrollbar';

class AllowScrollPlugin extends Scrollbar.ScrollbarPlugin {
  static defaultOptions = {
    allow: true,
  };

  transformDelta(delta: any) {
    return this.options.allow ? delta : { x: 0, y: 0 };
  }
}

AllowScrollPlugin.pluginName = 'allowScroll';

export default AllowScrollPlugin;
