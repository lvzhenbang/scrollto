import defaults from '../config/defaults';
import version from '../config/version';

import { getScrollPosition, setScrollPosition } from './utils/scrollPosition';
import getEasing from './utils/getEasing';
import inBrowser from './utils/inBrowser';

class ScrollTo {
  constructor(el, opt) {
    this.$el = el;
    this.options = {
      ...defaults,
      ...opt,
    };
    this.easing = null;
    this.duration = null;
    this.sanitizeScrollOptions();
    this.init();

    this.version = version;
  }

  init() {
    if (!(this.$el instanceof window.Element) && (this.$el !== window)) {
      throw new Error(`element passed to scrollTo() must be either the window or a DOM element, you passed ${this.$el}!`);
    }

    const currentScrollPosition = getScrollPosition(this.$el);
    this.scroll(
      currentScrollPosition,
      {
        top: this.options.top ? this.options.top : currentScrollPosition.top,
        left: this.options.left ? this.options.left : currentScrollPosition.left,
      },
      Date.now(),
      this.duration,
      getEasing(this.easing),
    );
  }

  sanitizeScrollOptions() {
    if (this.options.behavior === 'smooth') {
      this.easing = 'ease-in-out';
      this.duration = 300;
    } else {
      this.easing = 'linear';
      this.duration = 0;
    }
  }

  scroll(from, to, startTime, duration, easeFunc) {
    const step = () => {
      const stepPosition = from;
      const currentTime = Date.now();
      const time = Math.min(1, (currentTime - startTime) / duration);
      const easeValue = easeFunc(time);
      if (Object.prototype.hasOwnProperty.call(from, 'top') && from.top !== to.top) {
        stepPosition.top += easeValue * (to.top - from.top);
      }

      if (from.left !== to.left) {
        stepPosition.left += easeValue * (to.left - from.left);
      }

      if (from.top === to.top && from.left === to.left) {
        setScrollPosition(this.$el, to);
        window.cancelAnimationFrame(step);
        return;
      }

      setScrollPosition(this.$el, stepPosition);
      this.scroll(stepPosition, to, startTime, duration, easeFunc);
    };

    window.requestAnimationFrame(step);
  }
}

if (inBrowser) {
  window.ScrollTo = ScrollTo;
  window.console.log('plugin is running browser.');
}

export default ScrollTo;
