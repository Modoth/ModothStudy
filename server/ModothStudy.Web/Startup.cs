using System;
using System.Reflection;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ModothStudy.App.Common;
using ModothStudy.App.Controllers;
using ModothStudy.Repository;
using ModothStudy.Service;
using ModothStudy.ServiceInterface.AppServices;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Swashbuckle.AspNetCore.Swagger;
using ModothStudy.Web.Generated;
using ModothStudy.Service.EntityServices;
using ModothStudy.App;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.FileProviders;
using System.Collections.Generic;
using System.Linq;

namespace ModothStudy.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IContainer? ApplicationContainer { get; private set; }

        public IConfiguration Configuration { get; }

        private string? m_ExternAccessOrigins = null;

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            if (m_ExternAccessOrigins != null)
            {
                app.UseCors(m_ExternAccessOrigins);
            }
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
                app.UseHttpsRedirection();
            }
            app.Use(async (context, next) =>
    {
        await next();
        if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
        {
            context.Request.Path = "/index.html";
            await next();
        }
    });

            app.UseDefaultFiles(new DefaultFilesOptions { DefaultFileNames = new List<string> { "index.html" } });
            app.UseStaticFiles();
            var dataPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "files");
            if (!Directory.Exists(dataPath))
            {
                Directory.CreateDirectory(dataPath);
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(dataPath),
                RequestPath = "/files"
            });
            app.UseMiddleware<ServiceExceptionHandler>();
            app.UseSession();
            app.UseSwagger();
            app.UseMvc();
            InitData(serviceProvider).Wait();
        }


        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            var connStr = Configuration["ConnectionString"];
            services
                .AddDbContextPool<DataContext>(
                    options => options
                    .UseMySql(
                        connStr,
                        mySqlOptions =>
                        {
                            mySqlOptions
                                .MigrationsAssembly("ModothStudy.Web")
                                .ServerVersion(new Version(10, 3, 12), ServerType.MariaDb)
                                .CharSetBehavior(CharSetBehavior.AppendToAllColumns)
                                .AnsiCharSet(CharSet.Latin1)
                                .UnicodeCharSet(CharSet.Utf8mb4);
                        }
                    ));

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
            });
            services.AddSwaggerGen(c => { c.SwaggerDoc("api", new Info { Title = "api", Version = "v2.0" }); });
            var originsStr = Configuration["CorsOrigins"];
            if (!string.IsNullOrWhiteSpace(originsStr))
            {
                var origins = originsStr.Split(",").Select(o => o.Trim()).Where(o => o != string.Empty).ToList();
                if (origins.Count > 0)
                {
                    m_ExternAccessOrigins = "m_ExternAccessOrigins";
                    services.AddCors(options =>
                {
                    options.AddPolicy(m_ExternAccessOrigins,
                    builder =>
                    {
                        origins.ForEach(origin =>
                        {
                            builder.WithOrigins(origin)
                                                  .AllowAnyHeader()
                                                  .AllowAnyMethod();
                        });
                    });
                });
                }

            }
            services.AddMvc(options => options.Filters.Add<ModelStateValidatorFilter>())
                .AddApplicationPart(typeof(LoginController).Assembly)
                .SetCompatibilityVersion(CompatibilityVersion.Latest)
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                });
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            var builder = new ContainerBuilder();
            builder.Populate(services);
            RegisterServices(builder);
            ApplicationContainer = builder.Build();
            return new AutofacServiceProvider(ApplicationContainer);
        }

        private async Task InitData(IServiceProvider serviceProvider)
        {
            var repositoriesInitService = serviceProvider.GetService<IDataInitService>();
            await repositoriesInitService.Init();
        }

        private void RegisterServices(ContainerBuilder builder)
        {
            builder.Register<DataContextBase>(c => c.Resolve<DataContext>());
            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(DataContextBase)))
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(Program)))
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(UsersService)))
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(OperatorService)))
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(Program)))
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(UsersService)))
                .Where(t => t.Name.EndsWith("ServiceSingleton"))
                .AsImplementedInterfaces().SingleInstance();
        }
    }
}
