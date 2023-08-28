#!/bin/sh


# update the repository
sudo yum update -y

# move to the project folder
cd /home/ec2-user
cd backend


# Use Github credentials from .env file
source /home/ec2-user/2023-1-S1-Grupo5-Backend/.env

# checkout to the main branch
sudo git checkout main

# pull the changes with the credentials
sudo git pull https://$GITHUB_USERNAME:$GITHUB_PASSWORD@github.com/iic2154-uc-cl/2023-1-S1-Grupo5-Backend



# stop the containers
sudo docker-compose down

# build the containers
sudo docker-compose up -d --build