const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },

    rent: {
      type: Number,
      required: true,
      min: 1000,
    },

    deposit: {
      type: Number,
      default: 0,
    },

    propertyType: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "PG", "Studio"],
      required: true,
    },

    availableFrom: {
      type: Date,
      required: true,
    },

    furnished: {
      type: String,
      enum: ["fully", "semi", "unfurnished"],
      required: true,
    },

    amenities: {
      type: [String],
      enum: [
        "wifi",
        "ac",
        "parking",
        "laundry",
        "gym",
        "fridge",
        "kitchen",
        "power-backup",
      ],
      default: [],
    },

    roommatePreferences: {
      smoking: {
        type: Boolean,
        required: true,
      },

      food: {
        type: String,
        enum: ["veg", "non-veg"],
        required: true,
      },

      sleepTime: {
        type: String,
        enum: ["early", "late", "flexible"],
        required: true,
      },

      gender: {
        type: String,
        enum: ["male", "female", "any"],
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
        type: [Number],
        required: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxTenants: {
      type: Number,
      required: true,
      min: 1,
    },

    images: [
      {
        type: String,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

PropertySchema.index({ location: "2dsphere" });
PropertySchema.index({ rent: 1 });
PropertySchema.index({ "location.city": 1 });
PropertySchema.index({ amenities: 1 });

const PropertyModel = mongoose.model("Property", PropertySchema);

module.exports = PropertyModel;
