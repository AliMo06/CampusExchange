# CampusExchange

Requirements:
Node.js
React.js
PostgreSQL
Once node is installed, run the commands in requirements.txt


How to run:

1. Initialize Database:

    In a terminal, run the following command while in the CampusExchange Root Directory:
    createdb campus_exchange -U postgres
    node Application/src/initdb.js

    To view the database you may run the following:
    psql -U postgres -d campus_exchange

2. Run Backend:
In a terminal, run the following command while in the CampusExchange Root Directory

    npm run start

3. Run Frontend:

In a terminal run the following commands, starting at the CampusExchange Root Directory
        
    cd Presentation
    npm run dev

