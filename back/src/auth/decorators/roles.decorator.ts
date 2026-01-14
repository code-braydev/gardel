import { SetMetadata } from '@nestjs/common';
import { rolEmpleadoEnum } from '../../database/schema';

// Este decorador nos permitirá poner @Roles('jefe') en los controladores
export const ROLES_KEY = 'roles';
export const Roles = (
  ...roles: (typeof rolEmpleadoEnum.enumValues)[number][]
) => SetMetadata(ROLES_KEY, roles);
