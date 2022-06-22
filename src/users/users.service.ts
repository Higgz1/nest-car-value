import { Injectable, NotFoundException } from '@nestjs/common';
import { Db, Entity, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // created instance of Entity first
    // this could allow for further validation from the entity file
    const user = this.repo.create({ email, password });

    // save the instance created in to the Db.
    // passing the instance allows for hooks to run
    // use save {to insert & update } and remove {instead of delete} methods only. These make use of entity instances & run hooks
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
    });
    console.log(id);
  }

  find(email: string) {
    return this.repo.find({
      where: { email },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('user not found');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
