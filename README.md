# CATS Reference Collections Database

This application was created for cataloguing and retrieving a collection of samples related to the conservation of artwork. This includes paint cross sections, pigments, fibres and various other materials. In addition, any related analysis can also be cataloged. Search results can be viewed individually online, or downloaded as an excel file.

The technology stack for this application is a node/Express Server, Angularjs frontend and Mongodb database.

## How to use

Install git, npm, node, bower, mongo (this was tested with version 2.6.5) and graphicsmagick.

Clone the repository and install the dependencies:

    git clone https://github.com/StatensMuseumforKunst/CATSReferenceCollectionsDb.git
    npm install
    bower install

### Running the application

To run the tests and create the production files, just run grunt:

    grunt

To create the production files without tests (tests require mongod to be running and the correct version of PhantomJS to be installed) use the following command instead:

    grunt clean copy jadeUsemin

To start the app in production mode (uses minified and concatenated js files):

    NODE_ENV=production node app.js
    
Otherwise, to run in development mode, just use:

    NODE_ENV=development node app.js
    
Server runtime logs will be written to ./catsdb.log (logs are configurable in logging.js).
    
### Managing the application lifetime    

Install 'supervisor' to ensure the application is kept running, even after reboot

    sudo apt-get update
    sudo apt-get install supervisor

Add the following to /etc/supervisor/supervisord.conf 

    [program:mongod]
    command=/usr/bin/mongod
    directory=/home/cpo
    user=root
    autostart=true
    autorestart=true
    redirect_stderr=true
    stdout_logfile=/home/cpo/log/mongod.log
        
    [program:catsdb]
    command=node app.js
    directory=/home/cpo/git/CATSReferenceCollectionsDb
    user=root
    autostart=true
    autorestart=true
    redirect_stderr=true
    environment=NODE_ENV="production"

Run supervisor

    sudo service supervisor start
    
Logs can be found at /var/log/supervisor/supervisord.log.

### Running tests

When called, grunt will automatically run the tests, both backend and frontend. An explanation of the tests and testing tools used in this application can be found [here](/test/README.md).


## Example App

The CATS live instance of the database can be found [here](http://www.cats-cons.dk/). Editing records requires login credentials.

## Contact
CATS

## License
MIT
