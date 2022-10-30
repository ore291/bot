import {mongoose} from 'mongoose';



const botSchema = mongoose.Schema({
caption: {type : String },
image: {type: String},
activated: {type: Boolean, default: true},
phone: {type: String},
session: {type: String},
}, {
    timestamps: true
})

const Mbot = mongoose.model('bot', botSchema);

export default Mbot;