Tenant Management System API

There are two ways to run this API locally.

1. Use docker-compose (ensure docker-compose is installed and available)

    cd <CLONE_FOLDER>/api/tms
    docker-compose up --build

    Verify that API and databases are up:
        1. API: http://localhost:4144/v1/health
        2. Database: connect via pgadmin to port 5454


2. Use without docker - call the run script directly  

    Verify postgres is available and running. 
    Update .env to the correct database parameters
    
    cd <CLONE_FOLDER>/api/tms
    npm install

    Run pre-requisite database migrations via cmd: (install npx if not available)

        npx typeorm-ts-node-commonjs migration:run -d ./src/common/db.connection.ts

        Verify tables are created and available

    npm run dev

    Verify API is up via: http://localhost:4144/v1/health