# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: earendil <earendil@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/10/21 16:13:06 by earendil          #+#    #+#              #
#    Updated: 2023/10/22 16:22:19 by earendil         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all: migrate-dev

migrate-dev:
	@npx prisma migrate dev --name init --create-only
	@cat $$(echo constraints/*.sql) >> $$(echo migrations/*_init)/migration.sql
	@cat $$(echo populateDB/*.sql) >> $$(echo migrations/*_init)/migration.sql
	@npx prisma migrate dev

clean:
	rm -rf migrations/*

re: clean migrate-dev

.PHONY: all migrate-dev clean re