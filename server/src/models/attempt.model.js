import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    userId :{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    visibleName:{type: String,required: true},
    answers:{type: Array, required: true},
    score:{type:Number,required: true}
},
{
    timestamps: true
})

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;