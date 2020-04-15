import { MarkedRenderer, MarkedOptions } from "ngx-markdown";

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const backCode = renderer.code;
  renderer.code = (...args) => {
    return backCode.call(renderer, ...args);
  };

  return {
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}
