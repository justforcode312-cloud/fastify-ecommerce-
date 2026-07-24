import { JwtService } from '@/core/services/jwt.service';
import { PasswordService } from '@/core/services/password.service';
import { refreshTokenContainer } from '@/modules/refresh-token/refresh-token.container';
import { usersContainer } from '@/modules/users/users.container';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

class AuthContainer {
  public readonly authService: AuthService;
  public readonly authController: AuthController;

  constructor() {
    const jwtService = new JwtService();
    const passwordService = new PasswordService();

    this.authService = new AuthService(
      usersContainer.userService,
      refreshTokenContainer.refreshTokenService,
      jwtService,
      passwordService,
    );

    this.authController = new AuthController(this.authService);
  }
}

export const authContainer = new AuthContainer();
