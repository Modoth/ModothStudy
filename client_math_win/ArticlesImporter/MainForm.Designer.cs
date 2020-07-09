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
            this.btnOpen = new System.Windows.Forms.Button();
            this.lvwArticles = new System.Windows.Forms.ListView();
            this.pnlMenus = new System.Windows.Forms.Panel();
            this.btnUpload = new System.Windows.Forms.Button();
            this.txbServer = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.txbSubject = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.txbPassword = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.txbUserName = new System.Windows.Forms.TextBox();
            this.pgbRunning = new System.Windows.Forms.ProgressBar();
            this.label5 = new System.Windows.Forms.Label();
            this.txbReg = new System.Windows.Forms.TextBox();
            this.pnlMenus.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnOpen
            // 
            this.btnOpen.Location = new System.Drawing.Point(13, 11);
            this.btnOpen.Name = "btnOpen";
            this.btnOpen.Size = new System.Drawing.Size(111, 45);
            this.btnOpen.TabIndex = 0;
            this.btnOpen.Text = "打开";
            this.btnOpen.UseVisualStyleBackColor = true;
            this.btnOpen.Click += new System.EventHandler(this.btnOpen_Click);
            // 
            // lvwArticles
            // 
            this.lvwArticles.HideSelection = false;
            this.lvwArticles.Location = new System.Drawing.Point(12, 252);
            this.lvwArticles.Name = "lvwArticles";
            this.lvwArticles.Size = new System.Drawing.Size(1147, 565);
            this.lvwArticles.TabIndex = 1;
            this.lvwArticles.UseCompatibleStateImageBehavior = false;
            this.lvwArticles.View = System.Windows.Forms.View.Details;
            // 
            // pnlMenus
            // 
            this.pnlMenus.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.pnlMenus.Controls.Add(this.label5);
            this.pnlMenus.Controls.Add(this.txbReg);
            this.pnlMenus.Controls.Add(this.label3);
            this.pnlMenus.Controls.Add(this.txbPassword);
            this.pnlMenus.Controls.Add(this.label4);
            this.pnlMenus.Controls.Add(this.txbUserName);
            this.pnlMenus.Controls.Add(this.label2);
            this.pnlMenus.Controls.Add(this.txbSubject);
            this.pnlMenus.Controls.Add(this.label1);
            this.pnlMenus.Controls.Add(this.txbServer);
            this.pnlMenus.Controls.Add(this.btnUpload);
            this.pnlMenus.Controls.Add(this.btnOpen);
            this.pnlMenus.Location = new System.Drawing.Point(12, 12);
            this.pnlMenus.Name = "pnlMenus";
            this.pnlMenus.Size = new System.Drawing.Size(1147, 186);
            this.pnlMenus.TabIndex = 2;
            // 
            // btnUpload
            // 
            this.btnUpload.Location = new System.Drawing.Point(13, 75);
            this.btnUpload.Name = "btnUpload";
            this.btnUpload.Size = new System.Drawing.Size(111, 45);
            this.btnUpload.TabIndex = 1;
            this.btnUpload.Text = "上传";
            this.btnUpload.UseVisualStyleBackColor = true;
            this.btnUpload.Click += new System.EventHandler(this.btnUpload_Click);
            // 
            // txbServer
            // 
            this.txbServer.Location = new System.Drawing.Point(349, 21);
            this.txbServer.Name = "txbServer";
            this.txbServer.Size = new System.Drawing.Size(300, 35);
            this.txbServer.TabIndex = 2;
            this.txbServer.TextChanged += new System.EventHandler(this.txbServer_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(184, 26);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(130, 24);
            this.label1.TabIndex = 3;
            this.label1.Text = "服务器地址";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(184, 85);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(82, 24);
            this.label2.TabIndex = 5;
            this.label2.Text = "专题名";
            // 
            // txbSubject
            // 
            this.txbSubject.Location = new System.Drawing.Point(349, 80);
            this.txbSubject.Name = "txbSubject";
            this.txbSubject.Size = new System.Drawing.Size(300, 35);
            this.txbSubject.TabIndex = 4;
            this.txbSubject.TextChanged += new System.EventHandler(this.txbSubject_TextChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(668, 85);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(58, 24);
            this.label3.TabIndex = 9;
            this.label3.Text = "密码";
            // 
            // txbPassword
            // 
            this.txbPassword.Location = new System.Drawing.Point(833, 80);
            this.txbPassword.Name = "txbPassword";
            this.txbPassword.PasswordChar = '*';
            this.txbPassword.Size = new System.Drawing.Size(300, 35);
            this.txbPassword.TabIndex = 8;
            this.txbPassword.TextChanged += new System.EventHandler(this.txbPassword_TextChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(668, 26);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(82, 24);
            this.label4.TabIndex = 7;
            this.label4.Text = "用户名";
            // 
            // txbUserName
            // 
            this.txbUserName.Location = new System.Drawing.Point(833, 21);
            this.txbUserName.Name = "txbUserName";
            this.txbUserName.Size = new System.Drawing.Size(300, 35);
            this.txbUserName.TabIndex = 6;
            this.txbUserName.TextChanged += new System.EventHandler(this.txbUserName_TextChanged);
            // 
            // pgbRunning
            // 
            this.pgbRunning.Location = new System.Drawing.Point(15, 204);
            this.pgbRunning.Name = "pgbRunning";
            this.pgbRunning.Size = new System.Drawing.Size(1147, 42);
            this.pgbRunning.TabIndex = 3;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(184, 145);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(130, 24);
            this.label5.TabIndex = 11;
            this.label5.Text = "高级(匹配)";
            // 
            // txbReg
            // 
            this.txbReg.Location = new System.Drawing.Point(349, 140);
            this.txbReg.Name = "txbReg";
            this.txbReg.Size = new System.Drawing.Size(300, 35);
            this.txbReg.TabIndex = 10;
            this.txbReg.TextChanged += new System.EventHandler(this.txbReg_TextChanged);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 24F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1174, 829);
            this.Controls.Add(this.pgbRunning);
            this.Controls.Add(this.pnlMenus);
            this.Controls.Add(this.lvwArticles);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "MainForm";
            this.Text = "导入";
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.pnlMenus.ResumeLayout(false);
            this.pnlMenus.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnOpen;
        private System.Windows.Forms.ListView lvwArticles;
        private System.Windows.Forms.Panel pnlMenus;
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
    }
}

