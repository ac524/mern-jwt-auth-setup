const mapValidationErrors = errors => errors.reduce( (errors, {field, message}) => ({ ...errors, [field]: message }), {} );

const validateBodyWith = validator => ( req, res, next ) => {

    const result = validator( req.body );

    // Body data valid! Continue to the next step...
    if( true === result ) return next();

    // Validation failed! Send and error response.
    res.status(400).json( mapValidationErrors(result) );

}

module.exports = validateBodyWith;