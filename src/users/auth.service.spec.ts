import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    let users: User[] = [];
    // defined a fake usersService with the methods we use in the auth service
    fakeUsersService = {
      find: (email: string) => {
        const userFilter = users.filter((user) => user.email === email);
        return Promise.resolve(userFilter);
      },
      create: (email: string, password: string) => {
        const testUser = {
          id: Math.floor(Math.random() * 1000),
          email,
          password,
        } as User;

        users.push(testUser);
        return Promise.resolve(testUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signUp('test@hjfs.com', 'test');
    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('on signUp,throws an error if email is already in use', async () => {
    await service.signUp('test@hjfs.com', 'test');
    try {
      await service.signUp('test@hjfs.com', 'test');
    } catch (error) {
      expect(error.message).toBe('user is in use');
    }
  });

  it('on signIn ,if user is not found throw exception', async () => {
    try {
      await service.signIn('4@hjfs.com', 'test');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('on signIn,if user has an invalid password should throw an error', async () => {
    await service.signUp('test@hjfs.com', 'test');

    try {
      await service.signIn('test@hjfs.com', 'test1');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('finds correct user ', async () => {
    await service.signUp('test1@hjfs.com', 'test');

    const user = await service.signIn('test1@hjfs.com', 'test');
    expect(user).toBeDefined();
  });
});
