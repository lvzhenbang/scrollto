import defaults from '../config/defaults';
import version from '../config/version';

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
    if (!(this.$el instanceof window.Element)) {
      throw new Error(`element passed to scrollTo() must be either the window or a DOM element, you passed ${this.$el}!`);
    }

    const currentScrollPosition = this.getScrollPosition();

    if (this.options.top !== null) {
      this.scroll(
        currentScrollPosition.top,
        this.options.top,
        Date.now(),
        this.duration,
        getEasing(this.easing),
      );
    }

    if (this.options.left !== null) {
      this.scroll(
        currentScrollPosition.left,
        this.options.left,
        Date.now(),
        this.duration,
        getEasing(this.easing),
      );
    }
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

  getScrollPosition() {
    if (this.$el === document.body || this.$el === document.documentElement) {
      return {
        top: document.body.scrollTop || document.documentElement.scrollTop,
        left: document.body.scrollLeft || document.documentElement.scrollLeft,
      };
    }

    return {
      top: this.$el.scrollTop,
      left: this.$el.scrollLeft,
    };
  }

  setScrollPosition(value) {
    if (this.$el === document.body || this.$el === document.documentElement) {
      if (this.options.top !== null) {
        document.body.scrollTop = value;
        document.documentElement.scrollTop = value;
      } else {
        document.body.scrollLeft = value;
        document.documentElement.scrollLeft = value;
      }
    } else {
      if (this.options.top !== null) {
        this.$el.scrollTop = value;
      } else {
        this.$el.scrollLeft = value;
      }
    }
  }

  scroll(from, to, startTime, duration, easeFunc) {
    const step = () => {
      const currentTime = Date.now();
      const time = Math.min(1, (currentTime - startTime) / duration);
      const distance = easeFunc(time) * (to - from) + from;
      if (distance === to) {
        this.setScrollPosition(to);
        window.cancelAnimationFrame(step);
        return null;
      }
      this.setScrollPosition(distance);
      this.scroll(from, to, startTime, duration, easeFunc);
    };

    window.requestAnimationFrame(step);
  }
}

if (inBrowser) {
  window.ScrollTo = ScrollTo;
  window.console.log('plugin is running browser.');
}

export default ScrollTo;
