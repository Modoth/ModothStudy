using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

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
        }

        private void txbUserName_TextChanged(object sender, EventArgs e)
        {
            m_Controller.UserName = txbUserName.Text;
        }

        private void txbSubject_TextChanged(object sender, EventArgs e)
        {
            m_Controller.TargetSubject = txbSubject.Text;
        }

        private void txbPassword_TextChanged(object sender, EventArgs e)
        {
            m_Controller.Password = txbPassword.Text;
        }

        private void txbReg_TextChanged(object sender, EventArgs e)
        {
            m_Controller.HeaderReg = txbReg.Text;
        }
    }
}
