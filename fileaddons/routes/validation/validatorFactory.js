const Validator = require("fastest-validator");
const  { ObjectID } = require("mongodb");

const v = new Validator({
    defaults: {
        objectID: {
            ObjectID
        }
    }
});

const validatorFactory = schema => v.compile(schema);

module.exports = validatorFactory;