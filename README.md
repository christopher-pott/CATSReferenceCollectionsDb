# CATS Reference Collections Database

This application was created for cataloguing and retrieving a collection of samples related to the conservation of artwork. This includes paint cross sections, pigments, fibres and various other materials. In addition, any related analysis can also be cataloged. Search results can be viewed individually online, or downloaded as an excel file.

The technology stack for this application is a node/Express Server, Angularjs frontend and Mongodb database.

## How to use

Clone the repository and run:

```npm install```

### Running the application

Production mode (uses minified and concatenated js files):

To create the production files, just run grunt:

	grunt
	
To start the app:	

    NODE_ENV=production node app_mongo.js
    
Otherwise, to run in development mode, just use:
   
    NODE_ENV=development node app_mongo.js

### Running tests

When called, grunt will automatically run the tests, both backend and frontend.

An explanation of the tests and testing tools used in this application can be found at /test/README.md


## Example App

The CATS instance of the database can be viewed [here](https://github.com/btford/angular-express-blog). Editing records requires login credentials.

## Contact
CATS

## License
MIT
