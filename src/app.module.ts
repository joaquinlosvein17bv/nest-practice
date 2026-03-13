import { join } from 'path';// viene en nodejs
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';



@Module({
  imports: [
    ConfigModule.forRoot({
      load:[EnvConfiguration ],
      validationSchema: JoiValidationSchema,
    }),//siempre al inicio para cargar las variables de entorno sino no las va a reconocer
    //lo que hace el serverstatic module es servir archivos estaticos, en este caso la carpeta public, para que se puedan acceder a los archivos que hay dentro de esa carpeta desde el navegador
    ServeStaticModule.forRoot({
 rootPath: join(__dirname,'..','public'),
 }),
    MongooseModule.forRoot(process.env.MONGODB!),
    PokemonModule,
    CommonModule,
    SeedModule]
})
export class AppModule {
  
}
