export function getScrollPosition(el) {
  if (el === document.body || el === document.documentElement) {
    return {
      top: document.body.scrollTop || document.documentElement.scrollTop,
      left: document.body.scrollLeft || document.documentElement.scrollLeft,
    };
  }

  return {
    top: el.scrollTop,
    left: el.scrollLeft,
  };
}

export function setScrollPosition(el, position) {
  if (el === window) {
    document.documentElement.scrollLeft = position.left;
    document.documentElement.scrollTop = position.top;
  } else {
    el.scrollTop = position.top;
    el.scrollLeft = position.left;
  }
}
