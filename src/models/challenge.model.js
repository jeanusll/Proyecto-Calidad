import mongoose from "mongoose"

const challengeSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bannerPath: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    earnedPoints: {
        type: Number,
        default: 10
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("Challenge", challengeSchema)