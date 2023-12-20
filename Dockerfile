FROM node:20.9

# Set the working directory
WORKDIR /.

# Copy the built files from the build_output directory into the container
COPY . /


ENV BASE_URL=http://localhost:5000

RUN echo "BASE_URL=http://localhost:5000" > .env

EXPOSE 5000

# run the command to start the app
CMD ["npm", "run", "start:prod"]
