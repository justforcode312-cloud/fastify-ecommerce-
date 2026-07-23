import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshTokenService } from './refresh-token.service';

class RefreshTokenContainer {
  public readonly refreshTokenRepository: RefreshTokenRepository;
  public readonly refreshTokenService: RefreshTokenService;
  public readonly refreshTokenController: RefreshTokenController;

  constructor() {
    this.refreshTokenRepository = new RefreshTokenRepository();
    this.refreshTokenService = new RefreshTokenService(this.refreshTokenRepository);
    this.refreshTokenController = new RefreshTokenController(this.refreshTokenService);
  }
}

export const refreshTokenContainer = new RefreshTokenContainer();
