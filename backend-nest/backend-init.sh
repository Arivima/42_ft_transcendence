#!/bin/bash

npm i -D prisma
npm i -g @prisma/client
npm i --save class-validator class-transformer

npx prisma migrate dev

exec npm run start:dev