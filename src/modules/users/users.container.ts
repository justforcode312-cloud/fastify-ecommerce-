import { PasswordService } from '@/core/services/password.service';
import { UsersController } from '@/modules/users/users.controller';
import { UserRepository } from '@/modules/users/users.repository';
import { UsersService } from '@/modules/users/users.service';

class UsersContainer {
  public readonly userRepository: UserRepository;
  public readonly userService: UsersService;
  public readonly UserController: UsersController;
  public readonly passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
    this.userRepository = new UserRepository();
    this.userService = new UsersService(this.userRepository, this.passwordService);
    this.UserController = new UsersController(this.userService);
  }
}

export const usersContainer = new UsersContainer();
