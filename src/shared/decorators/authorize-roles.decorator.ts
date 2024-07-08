import { SetMetadata } from '@nestjs/common';

// currently not use
export const AuthorizeRoles = (...roles: string[]) =>
  SetMetadata('allowedRoles', roles);
