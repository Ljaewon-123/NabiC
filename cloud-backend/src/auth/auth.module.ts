import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudUser } from './entity/cloud-user.entity';
import { ConfigService } from '@nestjs/config';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({}), 
    TypeOrmModule.forFeature([CloudUser])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
