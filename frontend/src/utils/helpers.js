export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function uniqueId(prefix = 'id') {
  return prefix + '_' + Math.random().toString(36).substr(2, 9);
}
