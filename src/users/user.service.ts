import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import type { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
    [x: string]: any;
    constructor(
        @InjectRepository(UserEntity) 
        private repo: Repository<UserEntity>) {}

    findAll() {
        return this.repo.find({ take: 20 });
    }

    findOne(id: number) { 
        return this.repo.findOne({ where: { id }}); 
    }

    async findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
      }
      
      async findByPhone(phone: string) {
        return this.repo.findOne({ where: { phone } });
      }
      
      async findByEmailOrPhone(identifier: string) {
        const isEmail = identifier.includes('@');
        return this.repo
          .createQueryBuilder('u')
          .addSelect('u.passwordHash') // cần passwordHash để so sánh
          .where(isEmail ? 'u.email = :identifier' : 'u.phone = :identifier', { identifier })
          .getOne();
      }
      
      async create(data: { email?: string; phone?: string; name: string; passwordHash: string }) {
        const user = this.repo.create(data);
        return this.repo.save(user);
      }
}