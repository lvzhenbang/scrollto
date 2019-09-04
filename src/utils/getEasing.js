const easingMap = {
  linear: t => t,
  'ease-in': t => t * t,
  'ease-out': t => t * (2 - t),
  'ease-in-out': t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

const getEasing = (easing) => {
  const defaultEasing = 'linear';
  const easeFunc = easingMap[easing || defaultEasing];
  if (!easeFunc) {
    const options = Object.keys(easingMap).join(',');
    throw new Error(
      `Scroll error: scroller does not support an easing option of "${easing}". Supported options are ${options}`,
    );
  }
  return easeFunc;
};

export default getEasing;
