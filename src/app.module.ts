import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })],
  providers: [UserService],
})
export class ApplicationModule {}
