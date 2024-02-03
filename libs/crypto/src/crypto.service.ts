import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export class CryptoService {
  
  /**
   * Hash the given data with the BCRYPT_SALT constant.
   */
  async hash(data: string): Promise<string> {
    const salt = parseInt(
      process.env.BCRYPT_SALT,
      10,
    );
    return bcrypt.hash(data, salt);
  }

  /**
   * Check if the given data can be hashed to the given hash.
   */
  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
