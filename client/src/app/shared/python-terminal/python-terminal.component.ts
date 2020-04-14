import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  AfterViewChecked,
  EventEmitter,
} from "@angular/core";
import { IframePythonService } from "src/app/shared/python-service/python-service";
import { DomSanitizer } from "@angular/platform-browser";

class HistoryNavigator {
  public currentIdx = 0;
  public exps: string[] = [];

  add(exp: string) {
    if (exp !== this.exps[this.exps.length - 1]) {
      this.exps.push(exp);
    }
    this.currentIdx = this.exps.length;
  }

  load(offset: number): string {
    this.currentIdx += offset;
    if (this.currentIdx < 0) {
      this.currentIdx = 0;
    } else if (this.currentIdx > this.exps.length) {
      this.currentIdx = this.exps.length;
    }
    return this.exps[this.currentIdx] || "";
  }
}

class PlayToPyTranslator {
  toPyArgumentStr(str: string) {
    return str.replace(`'`, `\'`);
  }

  hasChinese(str) {
    return (
      str &&
      str.match(
        /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/
      )
    );
  }

  translate(playSrc: string): string[] {
    if (!playSrc.startsWith(`'''`)) {
      return [playSrc];
    }
    const pySrc = [];
    const indent = "  ";
    let funcSrc = null;
    let currentFuncIdx = 0;
    let currentFuncName = null;
    let hasChinese = this.hasChinese(playSrc);
    for (let line of playSrc.split("\n")) {
      line = line.trim();
      if (line === "") {
        continue;
      }
      if (line.startsWith(`'''`)) {
        if (funcSrc) {
          funcSrc.push("\n");
          pySrc.push(funcSrc.join("\n"));
          pySrc.push(`${currentFuncName}()`);
          funcSrc = null;
          currentFuncIdx++;
        } else {
          funcSrc = [];
          let sessionName = line.slice(`'''`.length).trim();

          if (sessionName !== "") {
            sessionName = sessionName;
          } else if (hasChinese) {
            sessionName = `第${currentFuncIdx}场`;
          } else {
            sessionName = `seccion_${currentFuncIdx}`;
          }
          currentFuncName = sessionName;
          funcSrc.push(`async def ${currentFuncName}():`);
          const newCmdStr = hasChinese
            ? `开始场景('${sessionName}')`
            : `startSession('${sessionName}')`;
          funcSrc.push(`${indent}${newCmdStr}`);
        }
        continue;
      }
      if (line.startsWith("【人物】")) {
        line = line.slice("【人物】".length);
        const reg = /(\S*)\s*（\s*(\S*)\s*饰）/g;
        while (true) {
          const match = reg.exec(line);
          if (!match) {
            break;
          }
          funcSrc.push(
            indent +
              `${match[1]} = 创建角色('${this.toPyArgumentStr(
                match[2]
              )}','${this.toPyArgumentStr(match[1])}')`
          );
        }
        continue;
      }
      if (line.startsWith("[chars]")) {
        line = line.slice("[chars]".length);
        const reg = /(\S*)\s*\(\s*(\S*)\s*play\)/g;
        while (true) {
          const match = reg.exec(line);
          if (!match) {
            break;
          }
          funcSrc.push(
            indent +
              `${match[1]} = createRole('${this.toPyArgumentStr(
                match[2]
              )}','${this.toPyArgumentStr(match[1])}')`
          );
        }
        continue;
      }
      const setMatch = line.match(/^【\s*(.*?)\s*】\s*(.*)$/);
      if (setMatch) {
        funcSrc.push(
          indent + `设置${setMatch[1]}('${this.toPyArgumentStr(setMatch[2])}')`
        );
        continue;
      }
      const setMatchEn = line.match(/^\[\s*(.*?)\s*\]\s*(.*)$/);
      if (setMatchEn) {
        funcSrc.push(
          indent +
            `set${setMatchEn[1]}('${this.toPyArgumentStr(setMatchEn[2])}')`
        );
        continue;
      }
      const sayMatchWithMotion = line.match(
        /^(.*?)\s*（\s*(.*?)\s*）\s*：\s*(.*)$/
      );
      if (sayMatchWithMotion) {
        funcSrc.push(
          indent +
            `await ${sayMatchWithMotion[1]}.说('${this.toPyArgumentStr(
              sayMatchWithMotion[3]
            )}', '${this.toPyArgumentStr(sayMatchWithMotion[2])}')`
        );
        continue;
      }
      const sayMatchWithMotionEn = line.match(
        /^(.*?)\s*\(\s*(.*?)\s*\)\s*:\s*(.*)$/
      );
      if (sayMatchWithMotionEn) {
        funcSrc.push(
          indent +
            `await ${sayMatchWithMotionEn[1]}.say('${this.toPyArgumentStr(
              sayMatchWithMotionEn[3]
            )}', '${this.toPyArgumentStr(sayMatchWithMotionEn[2])}')`
        );
        continue;
      }
      const sayMatch = line.match(/^(.*?)\s*：\s*(.*)$/);
      if (sayMatch) {
        funcSrc.push(
          indent +
            `await ${sayMatch[1]}.说('${this.toPyArgumentStr(sayMatch[2])}')`
        );
        continue;
      }
      const sayMatchEn = line.match(/^(.*?)\s*:\s*(.*)$/);
      if (sayMatchEn) {
        funcSrc.push(
          indent +
            `await ${sayMatchEn[1]}.say('${this.toPyArgumentStr(
              sayMatchEn[2]
            )}')`
        );
        continue;
      }
    }
    return pySrc;
  }
}

@Component({
  selector: "app-python-terminal",
  templateUrl: "./python-terminal.component.html",
  styleUrls: ["./python-terminal.component.scss"],
})
export class PythonTerminalComponent implements OnInit, AfterViewChecked {
  @Input() initCommends: string;

  @Input() loop = false;

  @Input() loopInterval = 5000;

  outputs: { type: string; value: string }[] = [];

  maxOutputsLength = 500;

  isEvaling = false;

  get input() {
    return this.inputRef.nativeElement && this.inputRef.nativeElement.value;
  }

  set input(value) {
    this.inputRef.nativeElement.value = value;
  }

  tabIndent = "    ";

  inputs: { indent: number; line: string; uncomplete: boolean }[] = [];

  nextIndent = 0;

  nextMinIndent = 0;

  nextMaxIndent = 0;

  inputPrefix = ">>> ";

  imeTarget: any;

  multilinePrefix = "... ";

  evalPrefix = "... ";

  useTerminalIme = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );

  @ViewChild("outputsRef") outputsRef: ElementRef<HTMLElement>;

  @ViewChild("inputRef") inputRef: ElementRef<HTMLInputElement>;

  @ViewChild("iframeRef") iframeRef: ElementRef<HTMLIFrameElement>;

  @Input() pythonService: IframePythonService;

  @Output() pythonServiceChanged = new EventEmitter<IframePythonService>();

  @Output() focusChanged = new EventEmitter<boolean>();

  history = new HistoryNavigator();

  url: any;

  public resolveWhenIframeLoaded;

  public replCmds = {
    ".clear": () => {
      this.outputs = [];
    },
  };

  constructor(
    public hostRef: ElementRef<HTMLElement>,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (!this.pythonService) {
      this.pythonService = new IframePythonService();
      const src = this.pythonService.getContent(
        "<html><script>window.onAppLoaded && window.onAppLoaded()</script></html>"
      );
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:text/html," + encodeURIComponent(src)
      );
      this.pythonService.getHost = this.getPythonServiceHost;
    }
    this.pythonService.stdout.subscribe((result) =>
      this.addToOutputs(result, "stdout")
    );
    this.pythonService.stderr.subscribe((error) =>
      this.addToOutputs(error, "stderr")
    );
    this.pythonService.reset().then(async () => {
      if (this.initCommends) {
        const translator = new PlayToPyTranslator();
        const cmds = translator.translate(this.initCommends);
        do {
          for (const command of cmds) {
            await this.evalExp(command, true);
          }
          await new Promise((resolve) =>
            setTimeout(resolve, this.loopInterval)
          );
        } while (this.loop);
      }
      await this.pythonServiceChanged.emit(this.pythonService);
    });
    this.outputsRef.nativeElement.onclick = () => {
      if (
        !this.useTerminalIme ||
        this.imeTarget === this.inputRef.nativeElement
      ) {
        return;
      }
      this.focusChanged.emit(true);
      setTimeout(() => {
        this.outputsRef.nativeElement.scrollTo({
          top: this.outputsRef.nativeElement.scrollHeight,
        });
      }, 200);
      this.imeTarget = this.inputRef.nativeElement;
    };
    setTimeout(() => {
      this.inputRef.nativeElement.focus();
    }, 200);
  }

  onImeClosed() {
    this.imeTarget = null;
    this.focusChanged.emit(false);
  }

  getPythonServiceHost = async (): Promise<HTMLIFrameElement> => {
    if (this.iframeRef && this.iframeRef.nativeElement) {
      return this.iframeRef.nativeElement;
    }
    const promise = new Promise<HTMLIFrameElement>(
      (resolve) => (this.resolveWhenIframeLoaded = resolve)
    );
    return promise;
  };

  ngAfterViewChecked() {
    if (
      this.iframeRef &&
      this.iframeRef.nativeElement &&
      this.resolveWhenIframeLoaded
    ) {
      const resolve = this.resolveWhenIframeLoaded;
      this.resolveWhenIframeLoaded = null;
      resolve(this.iframeRef.nativeElement);
    }
  }

  public addToOutputs(value: string, type = "stdin") {
    this.outputs.push({ value, type });
    if (this.outputs.length >= this.maxOutputsLength) {
      this.outputs.shift();
    }
    if (this.outputsRef.nativeElement.scrollTo) {
      setTimeout(() => {
        this.outputsRef.nativeElement.scrollTo({
          top: this.outputsRef.nativeElement.scrollHeight,
        });
      }, 0);
    }
  }

  public onKeyup(event: KeyboardEvent) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        event.stopPropagation();
        this.input = this.history.load(-1);
        break;
      case "ArrowDown":
        event.stopPropagation();
        this.input = this.history.load(1);
        break;
      case "Enter":
        event.stopPropagation();
        this.eval();
        break;
      case "Backspace":
        if (this.input === "") {
          event.stopPropagation();
          this.nextIndent = Math.max(this.nextMinIndent, this.nextIndent - 1);
        }
        break;
      case " ":
        if (this.input === " ") {
          event.stopPropagation();
          this.input = "";
          this.nextIndent = Math.min(this.nextIndent + 1, this.nextMaxIndent);
        }
        break;
    }
  }

  public async evalExp(exp, echoExp = false) {
    this.isEvaling = true;
    if (this.replCmds[exp]) {
      this.replCmds[exp]();
      this.isEvaling = false;
      return;
    }
    if (echoExp) {
      this.addToOutputs(this.inputPrefix + exp, "stdin");
    }
    try {
      const result = await this.pythonService.exec(exp);
      this.addToOutputs(result, result ? "stdout" : "stdout empty");
    } catch (error) {
      this.addToOutputs(error, "stderr");
    }
    this.isEvaling = false;
  }

  public getExpAndReset(): string {
    const inputs = this.inputs;
    this.inputs = [];
    this.nextIndent = 0;
    this.nextMinIndent = 0;
    this.nextMaxIndent = 0;
    return inputs.map(this.stringifyInputLine).join("\n");
  }

  public stringifyInputLine = (line) => {
    return this.tabIndent.repeat(line.indent) + line.line;
  };

  public formatInputLine = (line) => {
    return (
      (this.inputs.length > 0
        ? this.multilinePrefix + this.tabIndent.repeat(line.indent)
        : this.inputPrefix) + line.line
    );
  };

  public async eval() {
    if (!this.pythonService || this.isEvaling) {
      return;
    }
    const line = this.input.trim();
    if (line === "" && this.inputs.length === 0) {
      return;
    }
    this.input = "";
    const indent = this.nextIndent;
    const uncomplete = line.endsWith(":");
    if (uncomplete) {
      this.nextIndent += 1;
      this.nextMinIndent = this.nextIndent;
      this.nextMaxIndent = this.nextIndent;
    } else {
      this.nextMinIndent = 0;
      this.nextMaxIndent = indent;
    }
    const inputLine = { indent, line, uncomplete };
    this.addToOutputs(this.formatInputLine(inputLine));
    this.inputs.push(inputLine);
    if (indent === 0 && !uncomplete) {
      const exp = this.getExpAndReset();
      this.history.add(exp);
      this.loop = false;
      await this.evalExp(exp);
    }
  }
}
