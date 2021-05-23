const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const memberSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    indicatif: { type: String, required: true, unique: true },
    cin: { type: String, required: false },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    adresse: { type: String, required: false },
    _regionId : {type : mongoose.Schema.Types.ObjectId, required : true, ref :"Region"},
    inscriptionDate: { type: Date, required: true, default: new Date() },
    imagePath: { type: String, required: false },
    certifPath: { type: String, required: false },
    state: {
        type: String,
        default: "Accepted", //Pending
        enum: ["Pending", "Accepted", "Rejected"],
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "root"]
    }
});

memberSchema.plugin(uniqueValidator);
const member = mongoose.model('Member', memberSchema);

module.exports = member;