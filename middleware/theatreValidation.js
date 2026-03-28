const badRequestResponse = {
    status:false,
    err:"",
    data:[],
    message:'Bad Request | Malformed Request'
}

const theatreValidation = async(req,res,next)=>{


    if(!req.body.name){
        badRequestResponse.err = "The name of theatre must be present in Request";
        return res.status(422).json(badRequestResponse)
    }
    // validate description
    if(!req.body.description){
        badRequestResponse.err = "The description of theatre must be present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!req.body.city){
        badRequestResponse.err = "The city name of theatre must be present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!req.body.address){
        badRequestResponse.err = "The address of theatre must be present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!req.body.pincode){
        badRequestResponse.err = "The pincode of theatre must be present in Request";
        return res.status(422).json(badRequestResponse)
    }
    next();
}

const updateMoviesValidation = async(req,res,next)=>{

    if(req.body.insert === undefined){
        badRequestResponse.err = "The insert Paramter must be filled";
        return res.status(422).json(badRequestResponse);

    }
    // if(!req.body.movieIds){
    //     badRequestResponse.err="The coletions of movies Id Paramter must be filled";
    //     return res.status(422).json(badRequestResponse);
    // }

    if(!(req.body.movieIds instanceof Array)){
        badRequestResponse.err="Expected Ids in array but Not Found";
        return res.status(422).json(badRequestResponse);
    }
    if(req.body.movieIds.length<=0){
        badRequestResponse.err="No Movie Id Provided in the request";
        return res.status(422).json(badRequestResponse);
    }
    next();
}

module.exports = {theatreValidation,updateMoviesValidation};