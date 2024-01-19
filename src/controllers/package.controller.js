const PackageService = require("../services/package.service");
const createError = require("http-errors");

class PackageController {
  /**
   * Create a new package.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async createPackage(req, res) {
    try {
      const userId = req.user.id;
      const packageData = req.body;

      // Validate package data before sending it to the service
      const validatedPackageData = validatePackageData(packageData);
        // console.log("validated data : ",validated)
      const { success, package:createdPackage, error } = await PackageService.createPackage(
        userId,
        validatedPackageData
      );

      if (success) {
        return res.status(201).json({
          success: true,
          package: formatPackageResponse(createdPackage),
        });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  /**
   * Get details of a specific package.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getPackage(req, res) {
    try {
      const userId = req.user.id;
      const packageId = req.params.id;

      const { success, package:retrievedPackage, error } = await PackageService.getPackageById(
        userId,
        packageId
      );

      if (success) {
        return res.status(200).json({
          success: true,
          package: formatPackageResponse(retrievedPackage),
        });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async updatePackage(req, res) {
    try {
      const userId = req.user.id;
      const packageId = req.params.id;
      const packageData = req.body;

      // Validate package data before sending it to the service
      const validatedPackageData = validatePackageData(packageData);

      const { success, package: updatedPackage, error } = await PackageService.updatePackage(
        userId,
        packageId,
        validatedPackageData
      );

      if (success) {
        return res.status(200).json({
          success: true,
          package: formatPackageResponse(updatedPackage),
        });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async deletePackage(req, res) {
    try {
      const userId = req.user.id;
      const packageId = req.params.id;

      const { success, package:deletedPackage, error } = await PackageService.deletePackage(
        userId,
        packageId
      );

      if (success) {
        return res.status(200).json({
          success: true,
          package: formatPackageResponse(deletedPackage),
        });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async getAllPackages(req, res) {
    try {
      const userId = req.user.id;

      const { success, packages, error } = await PackageService.getAllPackages(
        userId
      );
        console.log("got packages : ",packages);
      if (success) {
        const formattedPackages = packages.map(formatPackageResponse);
        return res.status(200).json({
          success: true,
          packages: formattedPackages,
        });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

/**
 * Helper function to format the package response for consistent output.
 * @param {Object} package - Package object.
 * @returns {Object} - Formatted package response.
 */
function formatPackageResponse(package) {
  return {
    package_id: package._id,
    customer_id: package.customer,
    active_delivery_id: package.active_delivery,
    description: package.description,
    weight: package.weight,
    width: package.width,
    height: package.height,
    depth: package.depth,
    from_name: package.from_name,
    from_address: package.from_address,
    from_location: package.from_location,
    to_name: package.to_name,
    to_address: package.to_address,
    to_location: package.to_location,
    created_at: package.createdAt,
    updated_at: package.updatedAt,
  };
}

/**
 * Validate the package data before processing it.
 * @param {Object} packageData - Package data received from the request.
 * @returns {Object} - Validated package data.
 * @throws {Error} - Throws an error if the validation fails.
 */
function validatePackageData(packageData) {
  const {
    customer,
    description,
    weight,
    width,
    height,
    depth,
    from_name,
    from_address,
    from_location,
    to_name,
    to_address,
    to_location,
  } = packageData;

  // Ensure that all required properties are present
  if (
    !customer ||
    !description ||
    !weight ||
    !width ||
    !height ||
    !depth ||
    !from_name ||
    !from_address ||
    !from_location ||
    !to_name ||
    !to_address ||
    !to_location
  ) {
    throw createError.BadRequest("Missing required fields in package data");
  }

  // Validate the structure of from_location and to_location
  if (
    typeof from_location !== "object" ||
    typeof to_location !== "object" ||
    from_location === null ||
    to_location === null ||
    typeof from_location.lat !== "number" ||
    typeof from_location.lng !== "number" ||
    typeof to_location.lat !== "number" ||
    typeof to_location.lng !== "number"
  ) {
    throw createError.BadRequest(
      "Invalid from_location or to_location structure"
    );
  }

  return {
    customer,
    description,
    weight,
    width,
    height,
    depth,
    from_name,
    from_address,
    from_location,
    to_name,
    to_address,
    to_location,
  };
}

module.exports = PackageController;
