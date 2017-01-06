using System.Web.Http;
using GoldenEyeTest.Frontend;
using GoldenEye.Frontend.Core.Web.Controllers;
using Shared.Business.DTOs;
using Shared.Business.Services;

namespace GoldenEyeTest.Frontend.Controllers
{
    [Authorize]
    public class TaskController : RestControllerBase<ITaskRestService, TaskDTO>
    {
        public TaskController()
        {
        }

        public TaskController(ITaskRestService service)
            : base(service)
        {
        }
    }
}
