#!/bin/bash

npm i --save @nestjs/passport passport @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt

npm i --save prisma
npm i --save @prisma/client
npm i --save class-validator class-transformer

npx prisma migrate dev

exec npm run start:dev