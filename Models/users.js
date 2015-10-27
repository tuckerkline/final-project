var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username  : { type: String, required: true, unique: true },
    password  : { type: String, required: true },
    level     : { type: Number, default: 1 },
    xp        : { type: Number, default: 0},
    gold      : { type: Number, default: 20 },
    HP        : { type: Number, default: 10 },
    MP        : { type: Number, default: 10 },
    attackPower : { type: Number, default: 5},
    potions   : { type: Number, default: 4 },
    inventory : { type: Array,  default: ["wool hat", "cardboard sword"]}, 
});

module.exports = mongoose.model('user', userSchema);