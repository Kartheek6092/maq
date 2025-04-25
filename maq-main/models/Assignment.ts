import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    declarationContent: { type: String, required: false },
    instructions: { type: String, required: false },
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    logo: { type: String },
    companyName: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ✅ updated marks structure
    marks: [{
        email: { type: String, required: true },
        score: { type: Number, required: true }
    }],

    maxMarks: { type: Number, required: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, {
    timestamps: true,
});

export default mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
