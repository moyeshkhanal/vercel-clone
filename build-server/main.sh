#!bin/bash

export GIT_REPOSITORY_URL= "$GIT_REPOSITORY_URL"

# Clone the repository in output folder in the docker container
git clone "$GIT_REPOSITORY_URL" /home/app/output

exec node script.js