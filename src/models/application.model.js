const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      required: true,
      default: "pending",
    },

    aiAnalysis: {
      score: Number,
      pros: [String],
      conflicts: [String],
      summary: String,
      analyzedAt: Date,
    },
  },
  { timestamps: true },
);

const ApplicationModel = mongoose.model("Application", applicationSchema);

module.exports = ApplicationModel;
