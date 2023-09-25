#!/bin/bash

npm i -D prisma
npm i -g @prisma/client

npx prisma migrate dev

exec npm run start:dev