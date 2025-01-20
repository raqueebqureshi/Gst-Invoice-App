import StoreProfile from "../Models/storeInfoModel.js";

export const updateStoreProfile = async (req, res) => {
  try {
    // Extract data from the request body
    const { shopId, storeProfile, images, addresses, socialLinks } = req.body;

    // Validate required fields
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    // Find the existing store profile by shopId
    const existingProfile = await StoreProfile.findOne({ shopId });
    if (!existingProfile) {
      return res
        .status(404)
        .json({ error: "Store profile not found for the given shop ID." });
    }

    // Update the existing profile with new data
    existingProfile.storeProfile = storeProfile || existingProfile.storeProfile;
    existingProfile.images = images || existingProfile.images;
    existingProfile.addresses = addresses || existingProfile.addresses;
    existingProfile.socialLinks = socialLinks || existingProfile.socialLinks;

    // Save the updated profile
    await existingProfile.save();

    // Return the updated profile
    res.status(200).json({
      message: "Store profile updated successfully.",
      profile: existingProfile,
    });
  } catch (error) {
    console.error("Error updating store profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the store profile." });
  }
};





export const fetchShopProfile = async (req, res) => {
  try {
    // Extract shopId from the request query or body
    const { shopId } = req.query;

    // Validate required fields
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    // Fetch the store profile by shopId
    const storeProfile = await StoreProfile.findOne({ shopId });

    if (!storeProfile) {
      return res
        .status(404)
        .json({ error: "Store profile not found for the given shop ID." });
    }

    // Return the fetched store profile
    res.status(200).json({ message: "Store profile fetched successfully.", profile: storeProfile });
  } catch (error) {
    console.error("Error fetching store profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the store profile." });
  }
};