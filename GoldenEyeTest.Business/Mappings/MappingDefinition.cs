using AutoMapper;
using GoldenEye.Backend.Security.Model;
using GoldenEyeTest.Business.Entities;
using Shared.Business.DTOs;
using GoldenEye.Shared.Core.Mappings;
using GoldenEye.Shared.Core.Objects.DTO;

namespace GoldenEyeTest.Business.Mappings
{
    public class MappingDefinition : Profile, IMappingDefinition
    {
        protected override void Configure()
        {
            Mapper.CreateMap<TaskEntity, TaskDTO>()
                .IgnoreNonExistingProperties();
            Mapper.CreateMap<TaskDTO, TaskEntity>()
                .IgnoreNonExistingProperties();
            Mapper.CreateMap<User, UserDTO>()
                .IgnoreNonExistingProperties();
            Mapper.CreateMap<UserDTO, User>()
                .IgnoreNonExistingProperties();
        }
    }
}