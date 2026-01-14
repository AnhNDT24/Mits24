import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
	
		TypeOrmModule.forRootAsync({
		imports: [ConfigModule], 
		  inject: [ConfigService],
		  useFactory: (config: ConfigService) => ({
			type: 'mysql',
			host: config.get<string>('DB_HOST'),
			port: Number(config.get<string>('DB_PORT')),
			username: config.get<string>('DB_USER'),
			password: config.get<string>('DB_PASS'),
			database: config.get<string>('DB_NAME'),
			autoLoadEntities: true,
			synchronize: false,
			logging: true,
		  }),
		}),
		UsersModule,
		AuthModule,

	],

})
export class AppModule {}
