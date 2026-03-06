import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles.decorator'
import { UserPayload } from './jwt.strategy'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      Array<'ADMIN' | 'USER'>
    >(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user as UserPayload | undefined

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient role permissions')
    }

    return true
  }
}
