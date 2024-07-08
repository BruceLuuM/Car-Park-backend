import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrentUserMiddleware } from './shared/middlewares/current-user.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Parking } from './parking/entities/parking.entity';
import { UserService } from './user/user.service';
import { ParkingModule } from './parking/parking.module';
import { Card } from './parking/entities/card.entity';
import { ParkRegister } from './parking/entities/parkRegister.entity';
import { AuthModule } from './auth/auth.module';
import { SerialGateway } from './serial/serial.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.database.env', '.app.env', '.env'],
    }),
    // TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [UserEntity, Parking, Card, ParkRegister],
      migrations: [],
      synchronize: true,
      // autoLoadEntities: true,
      // timezone: '+07:00',
    }),
    UserModule,
    ParkingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SerialGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .exclude({ path: '/api/auth/confirm', method: RequestMethod.GET })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
