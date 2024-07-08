import { randomInt } from 'crypto';

export class OTPGenerator {
  private digits: string;

  constructor() {
    this.digits = '0123456789';
  }

  /**
   * Generates a random integer between min (inclusive) and max (inclusive)
   * @param min The minimum value (inclusive)
   * @param max The maximum value (inclusive)
   * @returns A random integer between min and max
   */
  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates an OTP of the specified length
   * @param length The length of the OTP to generate
   * @returns A string representing the generated OTP
   */
  public generateOTP(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += this.digits[this.getRandomInt(0, this.digits.length - 1)];
    }
    return otp;
  }

  /**
   * Generates an OTP of the specified length using a cryptographically secure method
   * @param length The length of the OTP to generate
   * @returns A string representing the generated OTP
   */
  public generateSecureOTP(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += this.digits[randomInt(0, this.digits.length)];
    }
    return otp;
  }
}
// // Example usage
// const otpGenerator = new OTPGenerator();
// const otpLength = 6;
// const otp = otpGenerator.generateOTP(otpLength);
// console.log(`Generated OTP: ${otp}`);

// const secureOtpLength = 6;
// const secureOtp = otpGenerator.generateSecureOTP(secureOtpLength);
// console.log(`Generated Secure OTP: ${secureOtp}`);
