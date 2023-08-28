
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy the files that declares the dependencies (in this case using yarn)
COPY package*.json ./

# Copy all the files into the container to run the app
COPY . .

# Install the dependencies
RUN npm install 

# This is for documentation only, the port muyst be exposed manually or in compose definition.
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "start" ]
# CMD ["npx", "sequelize-cli", "db:migrate", "&&", "npm", "run", "start"]