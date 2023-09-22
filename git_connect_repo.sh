#!/bin/bash

# TODO before this script
# add other users to your repo as collaborators


# Save current changes
ok=""
read -p \n"Save current changes (Type 'ok' to continue): " ok
if [ "$ok" == "ok" ]; then
    git add .
    git commit -m "auto save"
    git push
fi

# Pull latest master
ok=""
read -p "\nPull latest master (Type 'ok' to continue): " ok
if [ "$ok" == "ok" ]; then
    git pull git@github.com:Arivima/42_ft_transcendence.git master
fi

# Define the remote repository URL
REMOTE_REPO_ARIELLE="git@github.com:Arivima/42_ft_transcendence.git"
REMOTE_REPO_MATTEO="git@github.com:mmarinel/42RomaLuiss__ft_transcendence.git"
REMOTE_REPO_DAVIDE="git@github.com:ripa001/ft_transcendence.git"
REMOTE_REPO_CLAUDIO="git@github.com:ripa001/ft_transcendence.git"

# check current settings
ok=""
read -p "\nThese are the original settings for origin (Type 'ok' to continue): " ok
if [ "$ok" == "ok" ]; then
    git remote show origin
else
    exit 1
fi

# Check if the remotes already exist, and if not, add it
REPO_ARRAY=($REMOTE_REPO_ARIELLE $REMOTE_REPO_MATTEO $REMOTE_REPO_CLAUDIO $REMOTE_REPO_DAVIDE)
for element in "${REPO_ARRAY[@]}"
do
    echo "\nChecking if element is present: $element"
    if ! git remote | grep -q "Push  URL: $element"; then
        echo "Adding element: $element"
        git remote set-url --add --push origin $element
        echo "Remote repository added : $element"
    else
        echo "element already present: $element"
    fi
done

# Check if user repo is indeed in the list (can be replaced sometimes)
response=""
while [ "$name" != "Arielle" ] && [ "$name" != "Matteo" ] && [ "$name" != "Claudio" ] && [ "$name" != "Davide" ]
do
    echo "Please enter your name: Arielle | Matteo | Claudio | Davide"
    read name

    if [ "$name" != "Arielle" ] && [ "$name" != "Matteo" ] && [ "$name" != "Claudio" ] && [ "$name" != "Davide" ]
    then
        echo "Wrong input..."
    fi
done

REMOTE_REPO_USER=""
case $name in
    "Arielle")
        REMOTE_REPO_USER="$REMOTE_REPO_ARIELLE"
        ;;
    "Matteo")
        REMOTE_REPO_USER="$REMOTE_REPO_MATTEO"
        ;;
    "Claudio")
        REMOTE_REPO_USER="$REMOTE_REPO_CLAUDIO"
        ;;
    "Davide")
        REMOTE_REPO_USER="$REMOTE_REPO_DAVIDE"
        ;;
    *)
        echo "Error: Invalid name."
        exit 1
        ;;
esac

if ! git remote | grep -q "Push  URL: $REMOTE_REPO_USER"; then
    git remote set-url --add --push origin "$REMOTE_REPO_USER"
    echo "Remote repository added : $REMOTE_REPO_USER"
fi

# Test the final settings
ok=""
read -p "Testing the result? (Type 'ok' to continue): " ok
if [ "$ok" == "ok" ]; then
    git remote show origin
else
    exit 1
fi

# Test the installation
ok=""
read -p "Testing the settings? (Type 'ok' to continue): " ok
if [ "$ok" == "ok" ]; then
    touch test_repo
    git add .
    git commit -m "Test repository creation"
    git push
else
    exit 1
fi
