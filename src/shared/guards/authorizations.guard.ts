import {
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      // if (!request?.currentUser?.FK_role?.encode_name) {
      //   throw new UnauthorizedException('Missing user role');
      // }
      const isAdmin =
        request?.currentUser?.FK_role?.encode_name.includes('admin');
      const isLocalAdmin =
        request?.currentUser?.FK_role?.encode_name.includes('local_admin');

      if (isAdmin || isLocalAdmin) {
        return true; // User is admin or local admin, grant access
      }
      const results = Array.isArray(request?.currentUser?.FK_role?.encode_name)
        ? request?.currentUser?.FK_role?.encode_name.some((role) =>
            allowedRoles.includes(role),
          )
        : allowedRoles.includes(request?.currentUser?.FK_role?.encode_name);

      if (results) return true;
      Logger.error(new UnauthorizedException('Sorry, you are not authorized'));
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};

// older version --using AuthorizedRoles ---
// import { Reflector } from '@nestjs/core';
// @Injectable()
// export class AuthorizeGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext): boolean {
//     const allowedRoles = this.reflector.get<string[]>(
//       'allowedRoles',
//       context.getHandler(),
//     );
//     const request = context.switchToHttp().getRequest();

//     const results = Array.isArray(request?.currentUser?.roles)
//       ? request?.currentUser?.roles.some((role) => allowedRoles.includes(role))
//       : allowedRoles.includes(request?.currentUser?.roles);
//     if (results) return true;
//     throw new UnauthorizedException('Sorry, you are not authorized');
//   }
// }
