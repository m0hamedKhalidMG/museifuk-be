import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    useFactory: async (
    ) => ({
      type: 'postgres',
      url:process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
  }), UsersModule, AuthModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
