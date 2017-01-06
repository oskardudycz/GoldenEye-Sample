using GoldenEye.Backend.Core.Repository;
using GoldenEyeTest.Business.Context;
using GoldenEyeTest.Business.Entities;

namespace GoldenEyeTest.Business.Repository
{
    public class TaskRepository: RepositoryBase<TaskEntity>, ITaskRepository
    {
        public TaskRepository(ISampleContext context): base(context, context.Tasks)
        {
        }
    }
}