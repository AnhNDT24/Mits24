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
		  useFactory: (config: ConfigService) => {
			return {
			  type: 'mysql',
			  host: config.get('DB_HOST'),
			  port: Number(config.get('DB_PORT')),
			  username: config.get('DB_USER'),
			  password: config.get('DB_PASS'),
			  database: config.get('DB_NAME'),
			  autoLoadEntities: true,
			  synchronize: false,
			  logging: true,
		  };
		},
	}),
		UsersModule,
		AuthModule,

	],

})
export class AppModule {}
