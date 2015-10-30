var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username     : { type: String, required: true, unique: true },
    password     : { type: String, required: true },
    level        : { type: Number, default: 1 },
    xp           : { type: Number, default: 0},
    gold         : { type: Number, default: 20 },
    HP           : { type: Number, default: 20 },
    maxHP        : { type: Number, default: 20},
    MP           : { type: Number, default: 10 },
    attackPower  : { type: Number, default: 3},
    potions      : { type: Number, default: 4 },
    inventory    : { type: Object,  default: {} },
    dragonScales : { type: Number, default: 0},
    questNumber  : { type: Number, default: 0}, 
    skills       : { type: Array, default: []},
    dinoEggs     : { type: Number, default: 0},
});

module.exports = mongoose.model('user', userSchema); 