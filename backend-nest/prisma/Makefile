# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: earendil <earendil@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/10/21 16:13:06 by earendil          #+#    #+#              #
#    Updated: 2023/10/21 16:37:43 by earendil         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

migrate-dev:
	@npx prisma migrate dev --name init --create-only
	@cat $$(echo constraints/*.sql) >> $$(echo migrations/*_init)/migration.sql
	@npx prisma migrate dev

clean:
	rm -rf migrations/*