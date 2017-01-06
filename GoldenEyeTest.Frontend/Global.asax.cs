using System;
using System.Web.Optimization;
using GoldenEye.Frontend.Core.Web;

namespace GoldenEyeTest.Frontend
{
    public class MvcApplication : WebApplication
    {
        protected override void OnBundleConfig()
        {
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            base.OnBundleConfig();
        }

        protected override void OnUnandledExceptionCaught(Exception exception)
        {
            base.OnUnandledExceptionCaught(exception);
        }
    }
}
