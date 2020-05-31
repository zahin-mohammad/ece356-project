# Prereqs
- docker-compose
- mycli (command line cli) or any mysql client of your choosing
- npm v13.12

# Getting Started
- run the database using `docker-compose up -d`
- use mycli to connect to the database `mycli -u root  --password password --port 3308 --host localhost`
- inside of mycli run `source database_scripts/init.sql`
- exit mycli `exit`
- in bash run
  - `cd database_scripts`
  - `./import_data.sh`
- Test if import worked by loggin back into mycli and running `SELECT * from github.User limit 10;`

# Database
- In the server directory run `docker-compose up -d`
- To stop the database run `docker-compose down`
- To delete the data run `docker-compose down -v`

## Connecting to database
- host: localhost
- user: root
- password: password
- port: 3306
- with mycli run `mycli -u root  --password password --port 3308 --host localhost`

## Exporting Database
- in bash run `export_data.sh`

## Database script
- run `init-db.sql` to create an empty github database and create the `express` user for the express server

# Running the server
- run `npm i && npm start`
