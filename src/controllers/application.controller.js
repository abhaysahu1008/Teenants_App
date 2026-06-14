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

const MyApplicationController = async (req, res) => {
  try {
    const myApplications = await ApplicationModel.find({
      applicant: req.user._id,
    }).populate("property");

    res.status(200).json({
      success: true,
      results: myApplications.length,
      data: myApplications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const AllApplicationsController = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const AllApplications = await ApplicationModel.find({
      property: propertyId,
    }).populate("applicant");

    res.status(200).json({
      success: true,
      results: AllApplications.length,
      data: AllApplications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const AcceptApplicationsController = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationModel.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found!",
        success: false,
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        message: "Application already processed!",
        success: false,
      });
    }

    const property = await PropertyModel.findById(application.property);

    if (!property.createdBy.equals(req.user._id)) {
      return res.status(400).json({
        message: "You are not the owner!",
        success: false,
      });
    }

    application.status = "accepted";

    await application.save();

    property.tenants.push(application.applicant);

    if (property.tenants.length > property.maxTenants) {
      property.isAvailable = false;
    }

    await property.save();

    res.status(200).json({
      success: true,
      data: application,
      message: "Application accepted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const RejectApplicationsController = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationModel.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found!",
        success: false,
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        message: "Application already processed!",
        success: false,
      });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({
      success: true,
      data: application,
      message: "Application rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const DeleteApplicationsController = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationModel.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (!application.applicant.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not your application",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw ${application.status} application`,
      });
    }

    await ApplicationModel.findByIdAndDelete(applicationId);

    res.status(200).json({
      success: true,
      message: "Application withdrawn",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  CreateApplicationController,
  MyApplicationController,
  AllApplicationsController,
  AcceptApplicationsController,
  RejectApplicationsController,
  DeleteApplicationsController,
};
