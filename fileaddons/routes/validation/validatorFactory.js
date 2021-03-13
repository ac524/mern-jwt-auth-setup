const Validator = require("fastest-validator");
const  { ObjectID } = require("mongodb");

const v = new Validator({
    defaults: {
        objectID: {
            ObjectID
        }
    }
});

const validatorFactory = schema => v.compile({
    $$strict: "remove",
    ...schema
});

module.exports = validatorFactory;