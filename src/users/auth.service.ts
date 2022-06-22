import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto'; // randomBytes creates the salt , scrypt provides our hashing function
import { promisify } from 'util'; // hover to understand what it does

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // find if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('user is in use');
    }

    // generate salt
    const salt = randomBytes(8).toString('hex');

    // hash salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the salt and hash
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);
    return user;
  }

  async signIn(email: string, password: string) {
    // find the user
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('no user found');
    }
    // get salt from the saved user
    const [salt, savedHash] = user.password.split('.');
    // hash it with password provided
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // compare the saved password to the hashed
    if (savedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credentials');
    }
    return user;
  }
}
