using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PlotterSystem.Startup))]
namespace PlotterSystem
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
