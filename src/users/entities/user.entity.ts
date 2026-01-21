import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { UserAddressEntity } from "./user-address.entity";

export enum UserStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	BANNED = "banned",
}

@Entity({ name: "users" })
export class UserEntity {
	@PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
	id: number;

	@Column({ type: "varchar", length: 255, nullable: true, unique: true })
	email: string | null;

	@Column({
		name: "password_hash",
		type: "varchar",
		length: 255,
		select: false,
	})
	passwordHash: string;

	@Column({ type: "varchar", length: 120 })
	name: string;

	@Column({ type: "varchar", length: 20, nullable: true, unique: true })
	phone: string | null;

	@Column({ name: "full_name", type: "varchar", length: 120, nullable: true })
	fullName: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	avatar: string | null;

	@Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
	status: UserStatus;

	@Column({
		name: "refresh_token_hash",
		type: "varchar",
		length: 255,
		nullable: true,
		select: false,
	})
	refreshTokenHash: string | null;

	@OneToMany(
		() => UserAddressEntity,
		(a) => a.user,
	)
	addresses: UserAddressEntity[];

	@CreateDateColumn({ name: "created_at", type: "timestamp" })
	createAt: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamp" })
	updateAt: Date;
}
