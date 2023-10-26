# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    backend-init.sh                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: earendil <earendil@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/30 18:31:21 by avilla-m          #+#    #+#              #
#    Updated: 2023/10/07 18:13:42 by earendil         ###   ########.fr        #
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

npm i -D @types/multer


npm install iconv
npm install iconv-lite


npx prisma generate

nest update

exec npm run start:dev