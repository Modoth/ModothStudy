import { MarkedRenderer, MarkedOptions } from "ngx-markdown";

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const backCode = renderer.code;
  renderer.code = (code, language, isEscaped) => {
    let html = backCode.call(renderer, code, language, isEscaped);
    html = html.replace(
      /<\/pre>\n$/,
      `<span onclick="this.parentElement && this.parentElement.dispatchEvent(new CustomEvent('code-menu-click', {bubbles: true}))&&event.stopPropagation();"
class="code-menu" data-language="${language}"></span></pre>\n`
    );
    return html;
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
