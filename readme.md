# Deliverables

1. The Entity-Relationshup Model is in the root directory called `er-model-writeup.pdf`
2. The schema for the database is in `/server/database_scripts/create_schema.sql`
3. The code for the scraper can be found in `/scraper` and the code to import the data is in `/server/database_scripts`
4. The Video Demo of the project is in the root directory titled `356-demo.mov` and the code for the client code can be found in `/frontend/`

# Running the Application

## Prereqs

- docker-compose
- mycli (command line cli) or any mysql client of your choosing
- npm v13.12

## Running

- Follow the `Getting Started` steps in `./server`
- Make sure your Docker Desktop is on and running
- In the root folder run `npm install` and then `npm run dev` (this will both start docker, server and web application)
