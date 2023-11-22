# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    backend-init.sh                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/30 18:31:21 by avilla-m          #+#    #+#              #
#    Updated: 2023/11/22 20:27:52 by mmarinel         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#!/bin/bash

npm i -g @nestjs/cli

npm install --save @nestjs/swagger
npm i --save @nestjs/passport passport @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt

npm i --save 2fa-util

npm i --save prisma
npm i --save @prisma/client
npm i --save class-validator class-transformer
npm i --save @nestjs/websockets @nestjs/platform-socket.io
npm i --save @nestjs/swagger
npm i --save body-parser
# npm i --save @nestjs/swagger/dist/plugin
npm i --save bcrypt

npm i -D @types/multer


npm install iconv
npm install iconv-lite


npx prisma generate

# nest update

npm install

exec npm run start:dev