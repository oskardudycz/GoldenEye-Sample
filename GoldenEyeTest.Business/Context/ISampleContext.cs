using System.Data.Entity;
using GoldenEye.Backend.Core.Context;
using GoldenEyeTest.Business.Entities;

namespace GoldenEyeTest.Business.Context
{
    public interface ISampleContext: IDataContext
    {
        IDbSet<TaskEntity> Tasks { get; }
    }
}