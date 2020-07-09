using DocumentFormat.OpenXml.Drawing.Charts;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace ArticlesImporter
{
    public class Config
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public string HeaderReg { get; set; }

        public string BasePath { get; set; }

        public string TargetSubject { get; set; }

        public void CopyFrom(Config config)
        {
            UserName = config.UserName;
            Password = config.Password;
            BasePath = config.BasePath;
            TargetSubject = config.TargetSubject;
            HeaderReg = config.HeaderReg;
        }

        public Config CloneConfig()
        {
            var config = new Config();
            config.CopyFrom(this);
            return config;
        }
    }

    public class MainController : Config
    {
        private string configFile = "config.json";
        public void Init()
        {
            if (!File.Exists(configFile))
            {
                return;
            }
            try
            {
                var content = File.ReadAllText(configFile);
                var config = JsonConvert.DeserializeObject<Config>(content);
                this.CopyFrom(config);
                PropChangedHandler(nameof(BasePath));
                PropChangedHandler(nameof(UserName));
                PropChangedHandler(nameof(Password));
                PropChangedHandler(nameof(TargetSubject));
                PropChangedHandler(nameof(HeaderReg));
            }
            catch
            {
                Console.WriteLine("Open config file failed.");
            }
        }

        private void SaveConfig()
        {
            try
            {
                var config = this.CloneConfig();
                var content = JsonConvert.SerializeObject(config);
                File.WriteAllText(configFile, content);
            }
            catch
            {
                Console.WriteLine("Save config file failed.");
            }
        }

        public void Import()
        {
            Running = true;
            PropChangedHandler(nameof(Running));
            UpdateProgress(0);
            var dialog = new OpenFileDialog();
            dialog.Filter = "word files (*.docx)|*.docx";
            dialog.ShowDialog();

            var fIn = dialog.FileName;
            if (String.IsNullOrWhiteSpace(fIn))
            {
                return;
            }
            var reg = new Regex(String.IsNullOrWhiteSpace(HeaderReg) ? @"^\d+、" : HeaderReg);
            var conv = new ArticleConverter();

            Articles = conv.Convert(fIn, reg, UpdateProgress);
            PropChangedHandler(nameof(Articles));
            UpdateProgress(1);
            Running = false;
            PropChangedHandler(nameof(Running));
        }

        public void Upload()
        {
            Running = true;
            PropChangedHandler(nameof(Running));
            UpdateProgress(0);
            UploadInternal();
            Running = false;
            PropChangedHandler(nameof(Running));
            UpdateProgress(1);
        }

        public void UploadInternal()
        {
            if (String.IsNullOrWhiteSpace(BasePath) || String.IsNullOrWhiteSpace(UserName) || String.IsNullOrWhiteSpace(Password))
            {
                MessageBox.Show("请输入服务器地址用户名以及密码");
                return;
            }
            SaveConfig();
            if (Articles == null || !Articles.Any())
            {
                MessageBox.Show("请先打开文件");
                return;
            }
            var count = Articles.Count();
            float idx = 0;

            LoginApi loginApi = null;
            Configuration configuration = null;

            try
            {
                configuration = new Configuration { BasePath = BasePath };
                var client = configuration.ApiClient.RestClient;
                client.CookieContainer = new System.Net.CookieContainer();
                loginApi = new LoginApi(configuration);
                var loginRes = loginApi.PwdOn(new UserLogin(UserName, Password));
                if (!loginRes.Result.Value)
                {
                    MessageBox.Show("登陆失败");
                    return;
                }
            }
            catch
            {
                MessageBox.Show("登陆失败");
                return;
            }
            var filesApi = new FilesApi(configuration);
            var nodesApi = new NodesApi(configuration);
            var subjectRes = nodesApi.QueryNodes(new Query
            {
                Parent = "/adm",
                Where = new Condition
                {
                    Type = Condition.TypeEnum.Equal,
                    Prop = "Type",
                    Value = "FolderNode"
                }
            });
            if (!subjectRes.Result.Value)
            {
                MessageBox.Show("服务器错误：无法获取专题列表");
                return;
            }
            var subjects = subjectRes.Data.Data;
            var targetSubject = subjects.Last();
            if (!string.IsNullOrWhiteSpace(TargetSubject))
            {
                var select = subjects.FirstOrDefault(s => s.Name == TargetSubject);
                if (select != null)
                {
                    targetSubject = select;
                }
                else
                {
                    MessageBox.Show($"无此专题{TargetSubject}");
                    return;
                }
            }
            var typeTag = new TagsApi(configuration).AllTags().Data.Data.FirstOrDefault(t => t.Name == "类型");
            if (typeTag == null)
            {
                MessageBox.Show("服务器错误");
                return;
            }
            foreach (var article in Articles)
            {
                var files = new Dictionary<ArticleFile, string>();
                if (article.Files != null && article.Files.Length > 0)
                {
                    foreach (var f in article.Files)
                    {
                        using (var fs = File.Open(f.Path, FileMode.Open))
                        {


                            var fileUploadRes = filesApi.UploadFile(fs);
                            fs.Close();
                            if (!fileUploadRes.Result.Value)
                            {
                                MessageBox.Show("上传文件失败");
                                return;
                            }
                            files.Add(f, fileUploadRes.Data);
                        }
                    }
                }
                var createRes = nodesApi.CreateNode(Guid.NewGuid().ToString(), "Blog", targetSubject?.Id);
                if (!createRes.Result.Value)
                {
                    if (!createRes.Result.Value)
                    {
                        MessageBox.Show("创建失败");
                        return;
                    }
                }
                var content = JsonConvert.SerializeObject(new
                {
                    content = new
                    {
                        sections = new[]
                        {
                            new {name="题干",
                            content=article.Content}
                        }
                    },
                    files = article.Files.Select(f => new { name = f.Name, url = files[f] })
                });
                var updateTagRes = nodesApi.UpdateTag(createRes.Data.Id, typeTag.Id, "题库");
                if (!updateTagRes.Result.Value)
                {
                    if (!updateTagRes.Result.Value)
                    {
                        MessageBox.Show("更新类型失败");
                        return;
                    }
                }
                var fileIds = files.Values.ToList();
                var updateRes = nodesApi.UpdateBlogContent(createRes.Data.Id, content, fileIds);
                if (!updateRes.Result.Value)
                {
                    if (!updateRes.Result.Value)
                    {
                        MessageBox.Show("更新内容失败");
                        return;
                    }
                }
                UpdateProgress(idx / count);
                idx++;
            }
        }

        private void UpdateProgress(float progress)
        {
            Progress = (int)Math.Floor(progress * 100);
            PropChangedHandler(nameof(Progress));
        }

        public delegate void PropChanged(string propName);

        public event PropChanged PropChangedHandler;

        public IEnumerable<Article> Articles { get; set; }

        public int Progress { get; set; }

        public bool Running { get; set; }
    }
}