using ArticlesImporter.Bounds;
using CefSharp;
using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Threading;

namespace ArticlesImporter
{
    public static class BrowserFactory
    {
        public static ChromiumWebBrowser create(Form form, MainController controller, string url)
        {
            var settings = new CefSettings();
            settings.CachePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CefSharp", "Cache");
            CefSharpSettings.LegacyJavascriptBindingEnabled = true;
            CefSharpSettings.ConcurrentTaskExecution = true;
            Cef.Initialize(settings);
            var browser = new ChromiumWebBrowser(url);
            browser.KeyboardHandler = new CEFKeyBoardHander();
            var opt = new BindingOptions();
            browser.JavascriptObjectRepository.Register("formulaEditingService", new FormulaEditingService(form, Dispatcher.CurrentDispatcher, ()=> controller.FormulaEditorPath), isAsync: true, options: BindingOptions.DefaultBinder);
            browser.JavascriptObjectRepository.Register("autoAccountService", new AccountService(() =>
            {
                return new Account { userName = controller.UserName, password = controller.Password };
            }), isAsync: true, options: BindingOptions.DefaultBinder);
            return browser;
        }
    }
}
