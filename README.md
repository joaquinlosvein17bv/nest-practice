<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```
5. clonar el archivo ___.env.template___ y cambiar su nombre a ___.env___

6. Llenar las variables de entorno definidas en el ___.env___

7. Ejecutar la aplicacion en dev:
```
yarn start:dev
```

6. reconstruir la semilla 
```
http://localhost:3000/api/v2/seed
```
#ss Stack Usado
* MongoDB
* Nest