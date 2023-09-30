#!/bin/bash

#! TODO before this script
# add other users to your repo as collaborators if not done already

#! FOR INFORMATION, IF NEEDED USE MANUALLY, DO NOT UNCOMMENT
#! Following commands  = to delete repos from the push list
# git remote set-url --delete --push origin mmarinel/42RomaLuiss__ft_transcendence.git
# git remote set-url --delete --push origin Arivima/42_ft_transcendence.git
# git remote set-url --delete --push origin ripa001/ft_transcendence.git
# git remote set-url --delete --push origin CCantale/ft_Transcendence.git

#! persistency of setting
#! this script needs to be executed each time you git clone the project
#! to be changed with git Actions

# colors
RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'

# Define the remote repository URL
REMOTE_REPO_ARIELLE="git@github.com:Arivima/42_ft_transcendence.git"
REMOTE_REPO_MATTEO="git@github.com:mmarinel/42RomaLuiss__ft_transcendence.git"
REMOTE_REPO_DAVIDE="git@github.com:ripa001/ft_transcendence.git"
REMOTE_REPO_CLAUDIO="git@github.com:CCantale/ft_Transcendence.git"


# check current settings
printf ${CYAN}"\nThese are the original settings for origin ${RESET}(Type 'Enter' to continue): \n"
read USER_INPUT
git remote show origin

# Check if the remotes already exist, and if not, add it
printf ${CYAN}"\nNow adding the team repos ${RESET}(Type 'Enter' to continue): \n"
read USER_INPUT
REPO_ARRAY=($REMOTE_REPO_ARIELLE $REMOTE_REPO_MATTEO $REMOTE_REPO_CLAUDIO $REMOTE_REPO_DAVIDE)
for element in "${REPO_ARRAY[@]}"
do
    printf "\nChecking if element is present: $element\n"
    if ! git remote show origin | grep -q "Push  URL: $element"; then
        git remote set-url --add --push origin $element
        printf ${GREEN}"Remote repository added : $element\n"${RESET}
    else
        printf "element already present: $element\n"
    fi
done

# Check if user repo is indeed in the list (can be replaced sometimes)
REPO_ARRAY=($REMOTE_REPO_ARIELLE $REMOTE_REPO_MATTEO $REMOTE_REPO_CLAUDIO $REMOTE_REPO_DAVIDE)
for element in "${REPO_ARRAY[@]}"
do
    if git remote show origin | grep -q "Fetch URL: $element"; then
        git remote set-url --add --push origin $element
        printf ${GREEN}"\nRemote repository added : $element\n"${RESET}
    fi
done

# Test the final settings
printf ${CYAN}"\nFinal configuration\n"${RESET}
git remote show origin


















# ARCHIVES

# Check if user repo is indeed in the list (can be replaced sometimes)
# response=""
# while [ "$name" != "Arielle" ] && [ "$name" != "Matteo" ] && [ "$name" != "Claudio" ] && [ "$name" != "Davide" ]
# do
#     printf "\n"
#     printf "Please enter your name: Arielle | Matteo | Claudio | Davide"
#     read name

#     if [ "$name" != "Arielle" ] && [ "$name" != "Matteo" ] && [ "$name" != "Claudio" ] && [ "$name" != "Davide" ]
#     then
#         printf "Wrong input..."
#     fi
# done

# REMOTE_REPO_USER=""
# case $name in
#     "Arielle")
#         REMOTE_REPO_USER="$REMOTE_REPO_ARIELLE"
#         ;;
#     "Matteo")
#         REMOTE_REPO_USER="$REMOTE_REPO_MATTEO"
#         ;;
#     "Claudio")
#         REMOTE_REPO_USER="$REMOTE_REPO_CLAUDIO"
#         ;;
#     "Davide")
#         REMOTE_REPO_USER="$REMOTE_REPO_DAVIDE"
#         ;;
#     *)
#         printf "Error: Invalid name."
#         exit 1
#         ;;
# esac

# if ! git remote | grep -q "Push  URL: $REMOTE_REPO_USER"; then
#     git remote set-url --add --push origin "$REMOTE_REPO_USER"
#     printf "Remote repository added : $REMOTE_REPO_USER"
# else 
#     printf "Remote repository already present : $REMOTE_REPO_USER"
# fi

# # Save current changes
# USER_INPUT=""
# printf "\n"
# read -p "Save current changes (Type 'Enter' to continue): " USER_INPUT
# if [ "$USER_INPUT" == "USER_INPUT" ]; then
#     bit branch
#     printf "checking out to branch master" && git checkout master
#     git add .
#     git commit -m "auto save"
# fi

# # Pull latest master
# USER_INPUT=""
# printf "\n"
# read -p "Pull latest master (Type 'Enter' to continue): " USER_INPUT
# if [ "$USER_INPUT" == "USER_INPUT" ]; then
#     git pull git@github.com:Arivima/42_ft_transcendence.git master
# fi