import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

if (typeof setImmediate === 'undefined') {
  window.setImmediate = setTimeout;
}