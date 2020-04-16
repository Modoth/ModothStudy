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
      default:
        return content;
    }
  }
}
