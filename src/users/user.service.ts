import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import type { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UpdateDateColumn } from "./dto/update-profile.dto";
import { CreateUserInput } from "src/auth/dto/create-user-input.dto";
import *  as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
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
      
      async create(input: CreateUserInput) {
          return this.repo.save({
            email: input.email ?? null,
            phone: input.phone ?? null,
            name: input.name,
            passwordHash: input.passwordHash, 
            fullName: input.fullName,
            avatar: input.avatar,
            status: input.status,
          });
        }

      async createFromDto(dto: CreateUserDto) {
          const passwordHash = await bcrypt.hash(dto.password, 10);
          return this.repo.save({
            email: dto.email,
            phone: dto.phone,
            name: dto.name,
            passwordHash,
            fullName: dto.fullName,
            avatar: dto.avatar,
            status: dto.status,
          });
        }
        

      async setRefreshTokenHash(userId: number, refreshTokenHash: string) {
        await this.repo.update({ id: userId }, { refreshTokenHash });
      }

      async revokeRefreshToken(userId: number) {
        await this.repo.update({ id: userId }, { refreshTokenHash: null });
      }

      async findOneWithRefreshTokenHash(id: number) {
        return this.repo
          .createQueryBuilder('u')
          .addSelect('u.refreshTokenHash')
          .where('u.id = :id', { id })
          .getOne();
      }

      async update(id: number, dto: UpdateDateColumn) {
        const user = await this.repo.findOne({ where: {id}});
        if (!user) throw new NotFoundException('User not found');
        Object.assign(user, dto);
        return this.repo.save(user);
      }
    }