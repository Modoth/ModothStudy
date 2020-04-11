import { Observable, Subject } from "rxjs";

export interface IPythonService {
  reset: () => Promise<any>;
  exec: (exp: string) => Promise<string>;
  stdout: Observable<string>;
  stderr: Observable<string>;
}

export class IframePythonService implements IPythonService {
  stdout = new Subject<string>();

  stderr = new Subject<string>();

  getHost: () => Promise<HTMLIFrameElement>;

  public token: string;

  public expTokens = new Set<string>();

  public expPromises = new Map<string, { resolve: any; reject: any }>();

  public cmdIdx = 0;

  public host: HTMLIFrameElement;

  public inited = false;

  public initPromise: Promise<any>;

  public resolveInit: any;

  public expCheckInited = "expCheckInited";

  public expReload = ".expReload";

  getContent(content: string) {
    this.token = Math.random().toString().slice(2, 10);
    const src = `<script src="${window.location.origin}/assets/libs/brython.js">
    </script>
    <script type=text/python3>
from browser import window
from javascript import JSObject
apis = window.apis.to_dict()
printError = apis['printError']

def run(*coroutines):
    waiting = [coroutine for coroutine in coroutines]
    result = None
    while waiting:
        try:
            coroutine = waiting[0]
            if(None ==  coroutine):
                continue
            waiting.pop(0)
            result = coroutine
            if hasattr(coroutine, 'send'):
              result = coroutine.send(None)
        except StopIteration:
            continue
    return result

apis['_'] = None
def evalPy(x):
    try:
      res = apis['_'] = eval(x, apis)
      if hasattr(res, 'send'):
          res = run(res)
      isNone = __BRYTHON__.jsobj2pyobj(res) == None
      return '' if isNone else str(res) if hasattr(res, '__repr__') else res;
    except SyntaxError as msg:
      if str(msg) == 'eval() argument must be an expression':
        try:
          res = exec(x, apis)
          return '';
        except Exception as err:
          printError(str(err))
          return '';
      printError(str(msg))
      return ''
    except Exception as err:
      printError(str(err))
      return ''

window.evalPy = evalPy
    </script>
    <script>
window.onAppLoaded = () => {
  function print(result){
    window.parent.postMessage({
      expToken: '${this.token}',
      result
    }, '${window.location.origin}');
  }
  function printError(error){
    window.parent.postMessage({
      expToken: '${this.token}',
      error
    }, '${window.location.origin}');
  }
  function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time));
  }
  let apis = window.apis || {}
  apis.print = print;
  apis.printError = printError;
  apis.sleep = sleep;
  window.apis = apis;
  brython();
  window.addEventListener('message', m => {
    let data = m.data;
    if(data.expToken === '${this.token}'){
        switch(data.exp){
          case '${this.expCheckInited}':
              if(window.langServiceInited){
                window.parent.postMessage({
                    expToken: '${this.token}',
                    inited:true,
                  }, '${window.location.origin}')
            }
          break;
        }
        return;
    }
    try {
      if(data.exp === '${this.expReload}'){
        window.parent.postMessage({
          expToken: data.expToken,
          result:true,
        }, '${window.location.origin}')
        if(window.langServiceExcuted){
          window.location.reload();
        }
        return
      }
      window.langServiceExcuted = true;
      const promise = window.evalPy(data.exp);
      Promise.resolve(promise).then((result)=>{
        result = __BRYTHON__.pyobj2jsobj(result)
        window.parent.postMessage({
          expToken: data.expToken,
          result
        }, '${window.location.origin}')
      })
    } catch (error) {
      window.parent.postMessage({
        expToken: data.expToken,
        error
      }, '${window.location.origin}')
    }
  }, false);
  window.langServiceInited = true;
  window.parent.postMessage({
    expToken: '${this.token}',
    inited:true,
  }, '${window.location.origin}')
};
    </script>${content}`;
    return src;
  }

  reset = async (): Promise<any> => {
    if (this.inited) {
      await this.exec(this.expReload);
      await new Promise((resolve) => setTimeout(resolve, 50));
      this.inited = false;
    }
  };
  exec = async (exp: string): Promise<string> => {
    await this.init();
    this.cmdIdx++;
    const expToken = this.token + this.cmdIdx;
    this.expTokens.add(expToken);
    const promise = new Promise<string>((resolve, reject) => {
      this.expPromises.set(expToken, { resolve, reject });
    });
    this.host.contentWindow.postMessage({ expToken, exp }, "*");
    return await promise;
  };

  public async init(): Promise<any> {
    if (this.inited) {
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      return;
    }
    if (!this.host) {
      this.host = await this.getHost();
      window.addEventListener(
        "message",
        (event) => {
          if (
            event.origin !== "null" ||
            event.data == null ||
            event.data.expToken == null
          ) {
            return;
          }
          if (event.data.expToken === this.token) {
            if (event.data.inited) {
              if (this.resolveInit) {
                const resolveInit = this.resolveInit;
                this.resolveInit = null;
                resolveInit();
              }
            } else if (event.data.error) {
              this.stderr.next(event.data.error);
            } else {
              this.stdout.next(event.data.result);
            }
          } else if (this.expPromises.has(event.data.expToken)) {
            const { resolve, reject } = this.expPromises.get(
              event.data.expToken
            );
            this.expPromises.delete(event.data.expToken);
            if (event.data.error) {
              reject(event.data.error);
            } else {
              resolve(event.data.result);
            }
          }
        },
        false
      );
    }
    this.initPromise = new Promise<any>((resolve) => {
      this.resolveInit = resolve;
    }).then(() => {
      this.inited = true;
      this.initPromise = null;
    });

    this.host.contentWindow.postMessage(
      { expToken: this.token, exp: this.expCheckInited },
      "*"
    );
    await this.initPromise;
  }
}
