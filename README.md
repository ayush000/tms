# Timesheet Management System

**Tech Stack:**<br />
Backend is bootstrapped with `Express and swagger`<br />
    node: v10.16.3<br />
    npm: 6.9.0<br />
    sequelize: ORM<br />
    mysql as Database<br />
<br />
Frontend is bootstrapped with `Create React App`<br />
    React with node: v10.16.3 and npm: 6.9.0<br />


## Environment:

Environemt is to be defined for server and clinet both.

**Backend**
First, goto `server/config` folder inside parent directory

`touch .env`
Inside this env file create the following key-value pairs.
  jwtSecret=''
  jwtSessionTimeOut=''  // ex: 30m
  passwordSalt=''
  passwordHashAlgorithm = 'aes-256-ctr'


**Frontend**
Next, goto `client` directory inside the parent directory. 

`touch .env` 
in this file create the following key-value pairs
  NODE_PATH=src
  REACT_APP_BASE_URL=http://localhost:10010/api/v1/


## Backend Available Scripts
Inside the server folder of the parent directory, you can run in the following order: 

`npm install`
To install dependencies

`sudo npm install pm2 -g`<br />
`pm2 start app.js --name 'tms'`<br />
To keep the node process daemonized, monitored and kept alive forever. <br />
This will run the application on http://localhost:10010

`sequelize db:seed:all`
To create seed data for the database 


## Frontend Available Scripts

Inside the client folder of the parent directory, you can run:

`npm install`
To install dependencies

`npm start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


## Additional Scripts

`swagger project edit`
To check documentation of all the apis in a browser-based swagger editor


## About the project:

After you run the project, an admin user is created with the following credentials:

admin@test.com/Test@123

You can login with this user at http://localhost:3000/login to create other admin users or managers.
Basic users can be registered directly.

For now the project doesnot take into account the timezone differences.

