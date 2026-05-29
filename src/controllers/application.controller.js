const ApplicationModel = require("../models/application.model");
const PropertyModel = require("../models/property.model");

const CreateApplicationController = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { message } = req.body;

    const existingApplication = await ApplicationModel.findOne({
      applicant: req.user._id,
      property: propertyId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this property",
      });
    }

    const property = await PropertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!property.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This property is no longer available",
      });
    }

    if (property.tenants.length >= property.maxTenants) {
      return res.status(400).json({
        success: false,
        message: "This property is already full",
      });
    }

    if (property.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own property",
      });
    }

    const application = await ApplicationModel.create({
      applicant: req.user._id,
      property: propertyId,
      message: message || "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { CreateApplicationController };
