//import express from express
const express = require( 'express' );
const bodyParser = require ('body-parser' );
const morgan = require( 'morgan' );
const jsonParser = bodyParser.json();
const app = express();
const validateApiKey = require( './middleware/validate-bearer.token' );

app.use( morgan('dev') );

function middleware( req, res, next ){
    console.log("midleware");
    req.test ={};
    req.test.message="adding something to the request";
    next();
}



app.use(validateApiKey());

let listOfStudents = [
    {
        name:"Marcel",
        id: 123
    },
    {
        name:"Martin",
        id:456
    },
    {
        name:"Julieta",
        id:789
    }
];

//setup url for fetch call
app.get('/api/students', middleware, ( req, res ) => {
    console.log( "Getting all students." );
    console.log( req.test );

    console.log( "Headers",req.headers )

    return res.status( 200 ).json( listOfStudents ); 
});

app.get( '/api/studentById', ( req, res ) => {
    console.log( "getting student by id." );
    console.log( req.query );

    let id = req.query.id;

    if( id === undefined){//!id
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status( 406 ).end();
    }

    let result = listOfStudents.find( ( student ) => {
        if( student.id == id ){
            return student;
        }
    });

    if( !result ){
        res.statusMessage = `There are no students with the provided 'id=${id}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( {result} );
});


//http://localhost:8080/api/getStudentById/456
app.get( '/api/getStudentById/:id', ( req, res ) => {
    console.log("Getting a student by id using the integrated param.");
    console.log( req.params );

    let id = req.param.id;
} )

//evey time some one treies to post a new student, the jsonParser 
//middleware makes sure the format is appropiate
app.post( '/api/createStudent', jsonParser, ( req, res ) =>{
    console.log( "adding a new student");
    console.log( "Body ", req.body );

    let name = req.body.name;
    let id = req.body.id;

    if( !id || !name ){
        res.statusMessage = "One of this parametes is missing in the request : 'id'" ;
        return res.status( 406 ).end();
    }

    if( typeof(id) !== 'number' ){
        res.statusMessage = "The 'id' MUST be a number";

        return res.status( 409 ).end();
    }
    let flag = true;
    for( let i=0;i<listOfStudents.length; i++){
        if(listOfStudents[i].id === id ){
            flag = !flag;
            break;
        }
    }
    if ( flag ){
        let newStudent = { name, id };
        listOfStudents.push( { name, id } );

        return res.status( 200 ).json( newStudent );
    }else{
        res.statusMessage = "the 'id' is already on the student list. ";
        return res.status( 409 ).end();
    }
});

app.delete( '/api/removeStudent', ( req, res ) => {

    let id = req.query.id;

    if( !id ){
        res.statusMessage = "Please semd the 'id' to delete a student";
        return res.status (406 ).end();
    }

    let itemToRemove = listOfStudents.findIndex( ( student ) =>{
        if( student.id === Number( id )){
            return true;
        }
    });

    if( itemToRemove < 0 ){
        res.statusMessage = "That 'id' was not found in the list of students.";
        return res.status( 400 ).end();
    }

    listOfStudents.splice( itemToRemove, 1 );
    console.log( itemToRemove );
    return res.status( 204 ).end();
} )

//primary access point(port,)
app.listen(8088, ()=>{
    console.log("This server is runnign on port 8080");
});


//node server.js
//npm start
//task manager for port
//npm install -g nodemon //-g global  