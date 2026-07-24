import argon2 from 'argon2';

export class PasswordService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async validate(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
