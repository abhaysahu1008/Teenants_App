const PropertyModel = require("../models/property.model");

const propertyCreateController = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      deposit,
      propertyType,
      availableFrom,
      furnished,
      amenities,
      smoking,
      food,
      sleepTime,
      gender,
      longitude,
      latitude,
      address,
      city,
      maxTenants,
      images,
    } = req.body;

    const existingProperty = await PropertyModel.findOne({
      createdBy: req.user._id,
      $or: [
        { title },
        { "location.address": address },
        {
          "location.coordinates": [longitude, latitude],
        },
      ],
    });

    if (existingProperty) {
      return res.status(409).json({
        success: false,
        message: "You already have a property with this title or address",
      });
    }

    const property = new PropertyModel({
      title,
      description,
      rent,
      deposit,
      propertyType,
      availableFrom: new Date(availableFrom),
      furnished,
      amenities,
      roommatePreferences: {
        smoking,
        food,
        sleepTime,
        gender,
      },
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
        address,
        city,
      },
      createdBy: req.user._id,
      maxTenants,
      images: images || [],
    });

    await property.save();
    console.log("Creating a property");

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.log("FULL ERROR:", error); // add this
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const propertyViewController = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const propertyFound = await PropertyModel.findById(propertyId);

    if (!propertyFound) {
      return res.status(404).json({
        message: "Property not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property found",
      property: propertyFound,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const searchPropertyController = async (req, res) => {
  try {
    const {
      city,
      minRent,
      maxRent,
      food,
      smoking,
      furnished,
      propertyType,
      amenities,
    } = req.query;

    const filter = {
      isAvailable: true,
    };

    if (city) {
      filter["location.city"] = city;
    }

    if (minRent || maxRent) {
      filter.rent = {};

      if (minRent) {
        filter.rent.$gte = Number(minRent);
      }

      if (maxRent) {
        filter.rent.$lte = Number(maxRent);
      }
    }

    if (food) {
      filter["roommatePreferences.food"] = food;
    }

    if (smoking !== undefined && smoking !== "") {
      filter["roommatePreferences.smoking"] = smoking === "true";
    }

    if (furnished) {
      filter.furnished = furnished;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");

      filter.amenities = {
        $all: amenitiesArray,
      };
    }

    const properties = await PropertyModel.find(filter).populate(
      "createdBy",
      "name email",
    );

    res.status(200).json({
      success: true,
      results: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  propertyCreateController,
  propertyViewController,
  searchPropertyController,
};
