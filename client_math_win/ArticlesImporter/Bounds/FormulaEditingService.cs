using ArticlesImporter.Converts;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Threading;

namespace ArticlesImporter.Bounds
{
    public class FormulaEditingService
    {
        private Dispatcher dispatcher_;
        private Form form_;
        private Func<string> getEditorPath_;
        private TaskCompletionSource<bool> editTask_;

        public FormulaEditingService(Form form, Dispatcher dispatcher, Func<string> getEditorPath)
        {
            dispatcher_ = dispatcher;
            form_ = form;
            getEditorPath_ = getEditorPath;
        }

        public async Task<string> Edit(string origin)
        {
            try
            {
                form_.Activated += Form__Activated;
                var editorPath = getEditorPath_();
                if (editorPath == null || !File.Exists(editorPath))
                {
                    MessageBox.Show("未配置公式编辑器");
                }
                var baseDir = Path.Combine(Path.GetTempPath(), typeof(FormulaEditingService).Name);
                if (Directory.Exists(baseDir))
                {
                    Directory.Delete(baseDir, true);
                }
                Directory.CreateDirectory(baseDir);
                var conv = new FormulaConverter();
                var randomFile = Path.Combine(baseDir, Guid.NewGuid() + ".wmf");
                var failed = false;
                await dispatcher_.InvokeAsync(() =>
                {
                    try
                    {
                        if (!conv.ConvertTo(randomFile, $"\r\n<math>{origin}</math>\r\n"))
                        {
                            failed = true;
                        }
                    }
                    catch
                    {
                        failed = true;
                    }
                }
                    );
                if (failed)
                {
                    return origin;
                }
                var process = new Process();
                process.StartInfo = new ProcessStartInfo(editorPath, $"-new {randomFile}");
                process.Start();
                editTask_ = new TaskCompletionSource<bool>();
                using (FileSystemWatcher watcher = new FileSystemWatcher())
                {
                    watcher.Path = baseDir;
                    watcher.NotifyFilter = NotifyFilters.LastAccess
                                  | NotifyFilters.LastWrite
                                  | NotifyFilters.FileName
                                  | NotifyFilters.DirectoryName;

                    watcher.Renamed += (object sender, RenamedEventArgs e) =>
                    {
                        if (e.FullPath == randomFile)
                        {
                            editTask_.SetResult(true);
                            editTask_ = null;
                        }
                    };

                    watcher.EnableRaisingEvents = true;
                    failed = !(await editTask_.Task);
                }
                if (failed)
                {
                    return origin;
                }
                var newFor = origin;
                await dispatcher_.InvokeAsync(() =>
                {
                    try
                    {
                        newFor = conv.Convert(randomFile);
                    }
                    catch
                    {
                        failed = true;
                    }
                });
                if (failed)
                {
                    return origin;
                }
                return newFor;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return origin;
            }
            finally
            {
                form_.Activated -= Form__Activated;
                dispatcher_.Invoke(() =>
                {
                    form_.Activate();
                });
            }
        }

        private void Form__Activated(object sender, EventArgs e)
        {
            form_.Activated -= Form__Activated;
            if (editTask_ != null)
            {
                editTask_.SetResult(false);
                editTask_ = null;
            }
        }
    }
}
