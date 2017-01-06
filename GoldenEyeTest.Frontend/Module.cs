using GoldenEyeTest.Frontend;
using GoldenEye.Frontend.Security.Web;
using GoldenEye.Shared.Core.Modules;
using GoldenEye.Shared.Core.Modules.Attributes;
using Microsoft.Owin;

[assembly: ProjectAssembly]
[assembly: OwinStartup(typeof(OwinBoostrapper))]
namespace GoldenEyeTest.Frontend
{
    public class Module : ModuleBase
    {
        public override void Load()
        {
        }
    }
}