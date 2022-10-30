import {mongoose} from 'mongoose';



const activeSchema = mongoose.Schema({

activated: {type: Boolean, default: true},

}, {
    timestamps: true
})

const Activate = mongoose.model('activate', activeSchema);

export default Activate;