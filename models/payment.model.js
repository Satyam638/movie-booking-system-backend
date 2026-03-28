const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    bokingId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Booking'
    },
    amount:{
        type:Number,
    },
    paymentStatus:{
        type:String,
        // required:true,
        enum:{
            values:['SUCCESS','FAILED','PENDING']
        },
        default:'PENDING'
    }
},{
    timeStamps:true
})

const paymentModel = mongoose.model("Payment",paymentSchema);

module.exports = paymentModel;