import {mongoose} from 'mongoose';



const messageSchema = mongoose.Schema({
message: {type : String },
reply: {type: String},

}, {
    timestamps: true
})

const Message = mongoose.model('message', messageSchema);

export default Message;