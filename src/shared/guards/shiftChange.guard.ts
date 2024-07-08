import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const ShiftChange = (allowedShiftRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const results = Array.isArray(request?.currentUser?.shiftRoles)
        ? request?.currentUser?.shiftRoles.some((shiftRoles) =>
            allowedShiftRoles.includes(shiftRoles),
          )
        : allowedShiftRoles.includes(request?.currentUser?.shiftRoles);
      if (results) return true;
      throw new UnauthorizedException(
        'Sorry, you are not authorized - not your shift',
      );
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
