const apiKEY = "123";
function validateApiKey( req,res,next ){

    if( !req.headers.authorization ){
        res.statusMessage = "Unauthorized request. Please send the API Key";
        return res.status( 401 ).end();
    }
    console.log( req.headers.authorization );
    console.log(`Bearer ${apiKEY}`);
    if( req.headers.authorization !== `Bearer ${apiKEY}` ){
        res.statusMessage = "Unaauthorized request. Invalid API Key";
        return res.status( 401 ).end();
    }
    
    next();
}

module.exports = validateApiKey;