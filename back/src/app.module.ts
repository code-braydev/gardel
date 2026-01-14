import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'; // Agregamos NestModule y MiddlewareConsumer
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SedesModule } from './sedes/sedes.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { MockUserMiddleware } from './auth/mock-user.middleware'; // Importamos el middleware

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SedesModule,
    EmpleadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MockUserMiddleware).forRoutes('*');
  }
}
