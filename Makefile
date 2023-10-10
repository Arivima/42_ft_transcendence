# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: earendil <earendil@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/24 19:39:26 by mmarinel          #+#    #+#              #
#    Updated: 2023/10/07 17:35:47 by earendil         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#! we will modifie the headers with the name of the team...

SHELL=/bin/bash

# DOCKER RULES
all: 	up
re: 	fclean all
reset: 	kill all

up:
	@printf $(BOLDCYAN)"Building containers\n"$(RESET)
	@$(while [[ ! $$(docker ps --format "table {{.Names}}" | tail -n +2 | grep backend) ]]; do \
		sleep 30; \
	done;\
	docker exec -it backend npx prisma generate; \
	docker exec -it backend npx prisma migrate dev; \
	docker exec -d backend npx prisma studio &)
	@docker-compose up --build


down:
	@printf $(BOLDCYAN)"Stopping containers\n"$(RESET)
	docker-compose down

clean: down
	@printf $(BOLDCYAN)"Cleaning unused objects\n"$(RESET)
	@docker container prune -f

fclean: clean
	@printf $(BOLDCYAN)"Cleaning images\n"$(RESET)
	@for image_id in $$(docker images -q); do \
		docker rmi $$image_id; \
	done;
	@docker image prune -f

kill: fclean
	@printf $(BOLDCYAN)"Cleaning volumes\n"$(RESET)
	@for volume_name in $$(docker volume ls -q); do \
		docker volume rm $$volume_name; \
	done;
	docker system prune -a -f

# GIT RULES
connect:
	@printf $(BOLDCYAN)"Connecting team git repositories\n"$(RESET)
	./git_connect_repo.sh

commit : 
	@printf $(BOLDCYAN)"Committing changes : \n"$(RESET)
	./git_commit.sh

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

.PHONY: all clean fclean re up down kill reset git_init