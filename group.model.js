import {mongoose} from 'mongoose';



const groupSchema = mongoose.Schema({
id: {type : String },
}, {
    timestamps: true
})

const Group = mongoose.model('group', groupSchema);

export default Group;