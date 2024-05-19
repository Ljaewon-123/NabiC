import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards';
import { UploadModule } from './upload/upload.module';
import { ConfigService } from '@nestjs/config';
import { AtStrategy, RtStrategy } from './auth/strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'navi',
      entities: [__dirname + '/**/**/*.entity.{js,ts}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AuthModule,
    UploadModule,
  ],
  // controllers: [],
  providers: [
    AtStrategy, 
    RtStrategy, 
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ],
})
export class AppModule {}
