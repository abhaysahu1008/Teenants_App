const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
      },
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    budget: {
      min: {
        type: Number,
        required: true,
        min: 1000,
      },

      max: {
        type: Number,
        required: true,
        max: 100000,
      },
    },

    preferences: {
      sleepTime: {
        type: String,
        enum: ["early", "late", "flexible"],
        required: true,
      },
      smoking: {
        type: Boolean,
        required: true,
      },
      food: {
        type: String,
        enum: ["veg", "non-veg"],
        required: true,
      },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true },
);

UserSchema.index({ location: "2dsphere" });

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
