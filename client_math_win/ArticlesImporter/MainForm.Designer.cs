namespace ArticlesImporter
{
    partial class MainForm
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.btnOpen = new System.Windows.Forms.Button();
            this.lvwArticles = new System.Windows.Forms.ListView();
            this.ckbItalicAsFormula = new System.Windows.Forms.CheckBox();
            this.ckbIgnoreSsl = new System.Windows.Forms.CheckBox();
            this.label5 = new System.Windows.Forms.Label();
            this.txbReg = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.txbPassword = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.txbUserName = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.txbSubject = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.txbServer = new System.Windows.Forms.TextBox();
            this.btnUpload = new System.Windows.Forms.Button();
            this.pgbRunning = new System.Windows.Forms.ProgressBar();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tbpEdit = new System.Windows.Forms.TabPage();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.tabPage3 = new System.Windows.Forms.TabPage();
            this.backgroundWorker1 = new System.ComponentModel.BackgroundWorker();
            this.label6 = new System.Windows.Forms.Label();
            this.btnFormulaEditorPath = new System.Windows.Forms.Button();
            this.tabControl1.SuspendLayout();
            this.tabPage2.SuspendLayout();
            this.tabPage3.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnOpen
            // 
            this.btnOpen.Location = new System.Drawing.Point(8, 16);
            this.btnOpen.Margin = new System.Windows.Forms.Padding(4);
            this.btnOpen.Name = "btnOpen";
            this.btnOpen.Size = new System.Drawing.Size(112, 44);
            this.btnOpen.TabIndex = 0;
            this.btnOpen.Text = "打开";
            this.btnOpen.UseVisualStyleBackColor = true;
            this.btnOpen.Click += new System.EventHandler(this.btnOpen_Click);
            // 
            // lvwArticles
            // 
            this.lvwArticles.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lvwArticles.HideSelection = false;
            this.lvwArticles.Location = new System.Drawing.Point(8, 196);
            this.lvwArticles.Margin = new System.Windows.Forms.Padding(4);
            this.lvwArticles.Name = "lvwArticles";
            this.lvwArticles.Size = new System.Drawing.Size(1116, 556);
            this.lvwArticles.TabIndex = 1;
            this.lvwArticles.UseCompatibleStateImageBehavior = false;
            this.lvwArticles.View = System.Windows.Forms.View.Details;
            // 
            // ckbItalicAsFormula
            // 
            this.ckbItalicAsFormula.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.ckbItalicAsFormula.AutoSize = true;
            this.ckbItalicAsFormula.Location = new System.Drawing.Point(662, 92);
            this.ckbItalicAsFormula.Margin = new System.Windows.Forms.Padding(6);
            this.ckbItalicAsFormula.Name = "ckbItalicAsFormula";
            this.ckbItalicAsFormula.Size = new System.Drawing.Size(186, 28);
            this.ckbItalicAsFormula.TabIndex = 15;
            this.ckbItalicAsFormula.Text = "斜体作为公式";
            this.ckbItalicAsFormula.UseVisualStyleBackColor = true;
            this.ckbItalicAsFormula.CheckedChanged += new System.EventHandler(this.ckbItalicAsFormula_CheckedChanged);
            // 
            // ckbIgnoreSsl
            // 
            this.ckbIgnoreSsl.AutoSize = true;
            this.ckbIgnoreSsl.Location = new System.Drawing.Point(170, 92);
            this.ckbIgnoreSsl.Margin = new System.Windows.Forms.Padding(6);
            this.ckbIgnoreSsl.Name = "ckbIgnoreSsl";
            this.ckbIgnoreSsl.Size = new System.Drawing.Size(186, 28);
            this.ckbIgnoreSsl.TabIndex = 14;
            this.ckbIgnoreSsl.Text = "忽略证书错误";
            this.ckbIgnoreSsl.UseVisualStyleBackColor = true;
            this.ckbIgnoreSsl.CheckedChanged += new System.EventHandler(this.ckbIgnoreSsl_CheckedChanged);
            // 
            // label5
            // 
            this.label5.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(658, 28);
            this.label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(130, 24);
            this.label5.TabIndex = 11;
            this.label5.Text = "高级(匹配)";
            // 
            // txbReg
            // 
            this.txbReg.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.txbReg.Location = new System.Drawing.Point(822, 24);
            this.txbReg.Margin = new System.Windows.Forms.Padding(4);
            this.txbReg.Name = "txbReg";
            this.txbReg.Size = new System.Drawing.Size(300, 35);
            this.txbReg.TabIndex = 10;
            this.txbReg.TextChanged += new System.EventHandler(this.txbReg_TextChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(24, 152);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(58, 24);
            this.label3.TabIndex = 9;
            this.label3.Text = "密码";
            // 
            // txbPassword
            // 
            this.txbPassword.Location = new System.Drawing.Point(249, 141);
            this.txbPassword.Margin = new System.Windows.Forms.Padding(4);
            this.txbPassword.Name = "txbPassword";
            this.txbPassword.PasswordChar = '*';
            this.txbPassword.Size = new System.Drawing.Size(300, 35);
            this.txbPassword.TabIndex = 8;
            this.txbPassword.TextChanged += new System.EventHandler(this.txbPassword_TextChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(24, 94);
            this.label4.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(82, 24);
            this.label4.TabIndex = 7;
            this.label4.Text = "用户名";
            // 
            // txbUserName
            // 
            this.txbUserName.Location = new System.Drawing.Point(249, 81);
            this.txbUserName.Margin = new System.Windows.Forms.Padding(4);
            this.txbUserName.Name = "txbUserName";
            this.txbUserName.Size = new System.Drawing.Size(300, 35);
            this.txbUserName.TabIndex = 6;
            this.txbUserName.TextChanged += new System.EventHandler(this.txbUserName_TextChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(166, 28);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(82, 24);
            this.label2.TabIndex = 5;
            this.label2.Text = "专题名";
            // 
            // txbSubject
            // 
            this.txbSubject.Location = new System.Drawing.Point(272, 24);
            this.txbSubject.Margin = new System.Windows.Forms.Padding(4);
            this.txbSubject.Name = "txbSubject";
            this.txbSubject.Size = new System.Drawing.Size(300, 35);
            this.txbSubject.TabIndex = 4;
            this.txbSubject.TextChanged += new System.EventHandler(this.txbSubject_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(24, 28);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(130, 24);
            this.label1.TabIndex = 3;
            this.label1.Text = "服务器地址";
            // 
            // txbServer
            // 
            this.txbServer.Location = new System.Drawing.Point(249, 17);
            this.txbServer.Margin = new System.Windows.Forms.Padding(4);
            this.txbServer.Name = "txbServer";
            this.txbServer.Size = new System.Drawing.Size(300, 35);
            this.txbServer.TabIndex = 2;
            this.txbServer.TextChanged += new System.EventHandler(this.txbServer_TextChanged);
            // 
            // btnUpload
            // 
            this.btnUpload.Location = new System.Drawing.Point(8, 84);
            this.btnUpload.Margin = new System.Windows.Forms.Padding(4);
            this.btnUpload.Name = "btnUpload";
            this.btnUpload.Size = new System.Drawing.Size(112, 44);
            this.btnUpload.TabIndex = 1;
            this.btnUpload.Text = "上传";
            this.btnUpload.UseVisualStyleBackColor = true;
            this.btnUpload.Click += new System.EventHandler(this.btnUpload_Click);
            // 
            // pgbRunning
            // 
            this.pgbRunning.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pgbRunning.Location = new System.Drawing.Point(8, 144);
            this.pgbRunning.Margin = new System.Windows.Forms.Padding(4);
            this.pgbRunning.Maximum = 10000;
            this.pgbRunning.Name = "pgbRunning";
            this.pgbRunning.Size = new System.Drawing.Size(1116, 42);
            this.pgbRunning.TabIndex = 3;
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.tabPage2);
            this.tabControl1.Controls.Add(this.tbpEdit);
            this.tabControl1.Controls.Add(this.tabPage3);
            this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControl1.Location = new System.Drawing.Point(0, 0);
            this.tabControl1.Margin = new System.Windows.Forms.Padding(0);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(1174, 828);
            this.tabControl1.TabIndex = 17;
            // 
            // tbpEdit
            // 
            this.tbpEdit.Location = new System.Drawing.Point(8, 39);
            this.tbpEdit.Margin = new System.Windows.Forms.Padding(0);
            this.tbpEdit.Name = "tbpEdit";
            this.tbpEdit.Size = new System.Drawing.Size(1158, 781);
            this.tbpEdit.TabIndex = 0;
            this.tbpEdit.Text = "编辑";
            this.tbpEdit.UseVisualStyleBackColor = true;
            // 
            // tabPage2
            // 
            this.tabPage2.Controls.Add(this.ckbItalicAsFormula);
            this.tabPage2.Controls.Add(this.lvwArticles);
            this.tabPage2.Controls.Add(this.ckbIgnoreSsl);
            this.tabPage2.Controls.Add(this.pgbRunning);
            this.tabPage2.Controls.Add(this.label5);
            this.tabPage2.Controls.Add(this.txbReg);
            this.tabPage2.Controls.Add(this.btnOpen);
            this.tabPage2.Controls.Add(this.txbSubject);
            this.tabPage2.Controls.Add(this.label2);
            this.tabPage2.Controls.Add(this.btnUpload);
            this.tabPage2.Location = new System.Drawing.Point(8, 39);
            this.tabPage2.Margin = new System.Windows.Forms.Padding(4);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Padding = new System.Windows.Forms.Padding(4);
            this.tabPage2.Size = new System.Drawing.Size(1158, 781);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "导入";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // tabPage3
            // 
            this.tabPage3.Controls.Add(this.btnFormulaEditorPath);
            this.tabPage3.Controls.Add(this.label6);
            this.tabPage3.Controls.Add(this.label4);
            this.tabPage3.Controls.Add(this.txbServer);
            this.tabPage3.Controls.Add(this.label1);
            this.tabPage3.Controls.Add(this.txbUserName);
            this.tabPage3.Controls.Add(this.label3);
            this.tabPage3.Controls.Add(this.txbPassword);
            this.tabPage3.Location = new System.Drawing.Point(8, 39);
            this.tabPage3.Margin = new System.Windows.Forms.Padding(4);
            this.tabPage3.Name = "tabPage3";
            this.tabPage3.Size = new System.Drawing.Size(1158, 781);
            this.tabPage3.TabIndex = 2;
            this.tabPage3.Text = "配置";
            this.tabPage3.UseVisualStyleBackColor = true;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(24, 220);
            this.label6.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(178, 24);
            this.label6.TabIndex = 11;
            this.label6.Text = "公式编辑器路径";
            // 
            // btnFormulaEditorPath
            // 
            this.btnFormulaEditorPath.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnFormulaEditorPath.Location = new System.Drawing.Point(249, 213);
            this.btnFormulaEditorPath.Name = "btnFormulaEditorPath";
            this.btnFormulaEditorPath.Size = new System.Drawing.Size(905, 39);
            this.btnFormulaEditorPath.TabIndex = 12;
            this.btnFormulaEditorPath.UseVisualStyleBackColor = true;
            this.btnFormulaEditorPath.Click += new System.EventHandler(this.btnFormulaEditorPath_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 24F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1174, 828);
            this.Controls.Add(this.tabControl1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(4);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "MainForm";
            this.Text = "渐进式编辑器";
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.tabControl1.ResumeLayout(false);
            this.tabPage2.ResumeLayout(false);
            this.tabPage2.PerformLayout();
            this.tabPage3.ResumeLayout(false);
            this.tabPage3.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnOpen;
        private System.Windows.Forms.ListView lvwArticles;
        private System.Windows.Forms.Button btnUpload;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox txbPassword;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox txbUserName;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txbSubject;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txbServer;
        private System.Windows.Forms.ProgressBar pgbRunning;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox txbReg;
        private System.Windows.Forms.CheckBox ckbIgnoreSsl;
        private System.Windows.Forms.CheckBox ckbItalicAsFormula;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tbpEdit;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.TabPage tabPage3;
        private System.ComponentModel.BackgroundWorker backgroundWorker1;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button btnFormulaEditorPath;
    }
}

