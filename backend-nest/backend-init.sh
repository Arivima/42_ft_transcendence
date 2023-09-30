# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    backend-init.sh                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: avilla-m <avilla-m@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/30 18:31:21 by avilla-m          #+#    #+#              #
#    Updated: 2023/09/30 19:39:38 by avilla-m         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#!/bin/bash

npm i --save @nestjs/passport passport @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt

npm i --save prisma
npm i --save @prisma/client
npm i --save class-validator class-transformer

npx prisma generate

exec npm run start:dev