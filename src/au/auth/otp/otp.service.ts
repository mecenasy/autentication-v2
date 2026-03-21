import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  // constructor(private readonly jwtService: JwtService) {}
  public generateOtp(digits: number = 6): number {
    if (digits < 1) throw new Error('OTP must be at least 1 digit long');

    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    return Math.floor(min + Math.random() * (max - min + 1));
  }

  public generateToken(): string {
    return uuid();
  }

  // public async generateJWT(data: Record<string, string>) {
  //   const token = uuid();
  //   const secret = bcrypt.hashSync(token, 10);
  //   const accessToken = await this.jwtService.signAsync(data, {
  //     secret,
  //     expiresIn: 3600,
  //   });

  //   return {
  //     accessToken,
  //     secret,
  //   };
  // }
}
