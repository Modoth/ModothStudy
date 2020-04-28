import { Injectable } from "@angular/core";
import YAML from "yaml";

@Injectable({
  providedIn: "root",
})
export class DataConvertService {
  constructor() {}

  toJsonStr(content: string, type: string) {
    if (!content) {
      return content;
    }
    type = type && type.toLowerCase();
    switch (type) {
      case "yaml":
        const y = YAML.parse(content);
        return JSON.stringify(y);
      case "json":
        return content;
      default:
        return JSON.stringify(content);
    }
  }

  toHtmlStr(content: string, type: string) {
    switch (type) {
      case "html":
        return content;
      default:
        return `<script>window.appData=${this.toJsonStr(
          content,
          type
        )}</script>\n`;
    }
  }
}
