# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/24 19:39:26 by mmarinel          #+#    #+#              #
#    Updated: 2023/09/25 18:48:40 by mmarinel         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#! we will modifie the headers with the name of the team...

SHELL=/bin/bash

all: up

up:
	docker-compose up --build

down:
	docker-compose down

clean:
	@docker container prune -f

fclean: clean
	@for image_id in $$(docker images -q); do \
		docker rmi $$image_id; \
	done;
	@docker image prune -f

push:
	git push origin
	git push arielle

re: fclean all

# Colors
RESET					:= "\033[0m"
BLACK					:= "\033[30m"
RED						:= "\033[31m"
GREEN					:= "\033[32m"
YELLOW					:= "\033[33m"
BLUE					:= "\033[34m"
MAGENTA					:= "\033[35m"
CYAN					:= "\033[36m"
WHITE					:= "\033[37m"
BOLDBLACK				:= "\033[1m\033[30m"
BOLDRED					:= "\033[1m\033[31m"
BOLDGREEN				:= "\033[1m\033[32m"
BOLDYELLOW				:= "\033[1m\033[33m"
BOLDBLUE				:= "\033[1m\033[34m"
BOLDMAGENTA				:= "\033[1m\033[35m"
BOLDCYAN				:= "\033[1m\033[36m"
BOLDWHITE				:= "\033[1m\033[37m"

.PHONY: all clean fclean re push