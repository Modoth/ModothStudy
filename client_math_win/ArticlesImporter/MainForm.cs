using ArticlesImporter.Bounds;
using ArticlesImporter.Converts;
using CefSharp;
using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Threading;

namespace ArticlesImporter
{
    public partial class MainForm : Form
    {
        public MainForm(MainController controller)
        {
            this.m_Controller = controller;
            this.m_Controller.PropChangedHandler += propChangedHandler;
            InitializeComponent();
        }

        private void propChangedHandler(string propName)
        {
            switch (propName)
            {
                case nameof(MainController.Articles):
                    RenderArticles();
                    break;
                case nameof(MainController.Running):
                    btnOpen.Enabled = !m_Controller.Running;
                    btnUpload.Enabled = !m_Controller.Running;
                    break;
                case nameof(MainController.Progress):
                    pgbRunning.Value = m_Controller.Progress;
                    break;
                case nameof(MainController.BasePath):
                    txbServer.Text = m_Controller.BasePath;
                    RefreshEditing();
                    break;
                case nameof(MainController.UserName):
                    txbUserName.Text = m_Controller.UserName;
                    break;
                case nameof(MainController.Password):
                    txbPassword.Text = m_Controller.Password;
                    break;
                case nameof(MainController.TargetSubject):
                    txbSubject.Text = m_Controller.TargetSubject;
                    break;
                case nameof(MainController.HeaderReg):
                    txbReg.Text = m_Controller.HeaderReg;
                    break;
                case nameof(MainController.IgnoreSslError):
                    ckbIgnoreSsl.Checked = m_Controller.IgnoreSslError;
                    break;
                case nameof(MainController.ItalicAsFormula):
                    ckbItalicAsFormula.Checked = m_Controller.ItalicAsFormula;
                    break;
                case nameof(MainController.FormulaEditorPath):
                    btnFormulaEditorPath.Text = m_Controller.FormulaEditorPath;
                    break;
                case nameof(MainController.UseCache):
                    ckbCleanNext.Checked = m_Controller.UseCache;
                    break;

            }
        }

        private void RefreshEditing()
        {
            var url = string.IsNullOrEmpty(m_Controller.BasePath) ? "about://blank" : m_Controller.BasePath;
            if (browser == null)
            {
                browser = BrowserFactory.create(this, m_Controller, url);
                tbpEdit.Controls.Add(browser);
                browser.Dock = DockStyle.Fill;
                browser.Margin = new Padding(0, 0, 0, 0);
                browser.Padding = new Padding(0, 0, 0, 0);
            }
            else
            {
                browser.Load(url);
            }
        }

        private void RenderArticles()
        {
            var articles = this.m_Controller.Articles;
            lvwArticles.Items.Clear();
            if (articles == null || !articles.Any())
            {
                return;
            }
            var idx = 0;
            foreach (var article in articles)
            {
                ListViewItem item = new ListViewItem();
                item.Text = (idx + 1).ToString();
                item.SubItems.Add(article.Content);
                lvwArticles.Items.Add(item);
                idx++;
            }
            lvwArticles.Columns[1].AutoResize(ColumnHeaderAutoResizeStyle.ColumnContent);
        }

        private readonly MainController m_Controller;

        private void btnOpen_Click(object sender, EventArgs e)
        {
            this.m_Controller.Import();
        }

        private ChromiumWebBrowser browser;

        private void MainForm_Load(object sender, EventArgs e)
        {
            lvwArticles.Columns.Add("");
            lvwArticles.Columns.Add("内容");
            m_Controller.Init();

        }

        private void btnUpload_Click(object sender, EventArgs e)
        {
            this.m_Controller.Upload();
        }

        private void txbServer_TextChanged(object sender, EventArgs e)
        {
            m_Controller.BasePath = txbServer.Text;
            m_Controller.SaveConfig();
            RefreshEditing();
        }

        private void txbUserName_TextChanged(object sender, EventArgs e)
        {
            m_Controller.UserName = txbUserName.Text;
            m_Controller.SaveConfig();
        }

        private void txbSubject_TextChanged(object sender, EventArgs e)
        {
            m_Controller.TargetSubject = txbSubject.Text;
            m_Controller.SaveConfig();
        }

        private void txbPassword_TextChanged(object sender, EventArgs e)
        {
            m_Controller.Password = txbPassword.Text;
            m_Controller.SaveConfig();
        }

        private void txbReg_TextChanged(object sender, EventArgs e)
        {
            m_Controller.HeaderReg = txbReg.Text;
            m_Controller.SaveConfig();
        }

        private void ckbIgnoreSsl_CheckedChanged(object sender, EventArgs e)
        {
            m_Controller.IgnoreSslError = ckbIgnoreSsl.Checked;
            m_Controller.SaveConfig();
        }

        private void ckbItalicAsFormula_CheckedChanged(object sender, EventArgs e)
        {
            m_Controller.ItalicAsFormula = ckbItalicAsFormula.Checked;
            m_Controller.SaveConfig();
        }

        private void btnFormulaEditorPath_Click(object sender, EventArgs e)
        {
            var dialog = new OpenFileDialog();
            dialog.Filter = "可执行程序(*.exe)|*.exe";
            var res = dialog.ShowDialog();
            if((res == DialogResult.OK || res == DialogResult.Yes )&& dialog.FileName != null && File.Exists(dialog.FileName))
            {
                m_Controller.FormulaEditorPath = dialog.FileName;
                btnFormulaEditorPath.Text = m_Controller.FormulaEditorPath;
                m_Controller.SaveConfig();
            }
        }

        private void ckbCleanNext_CheckedChanged(object sender, EventArgs e)
        {
            m_Controller.UseCache = ckbCleanNext.Checked;
            m_Controller.SaveConfig();
        }
    }
}
