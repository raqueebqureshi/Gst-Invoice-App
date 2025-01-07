import StoreProfile from "../Models/storeInfoModel.js";

export const createStoreProfile = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      storeDomain,
      email,
      storeProfile,
      images,
      addresses,
      socialLinks,
    } = req.body;
  

    // Validate required fields
    if (!email || !storeDomain) {
      return res.status(400).json({ error: "Email and storeDomain are required" });
    }

    // Check if the store profile already exists
    const existingProfile = await StoreProfile.findOne({ email, storeDomain });
    if (existingProfile) {
      return res.status(400).json({ error: "Store profile already exists" });
    }

    // Create a new store profile
    const newStoreProfile = new StoreProfile({
      storeDomain,
      email,
      storeProfile,
      images,
      addresses,
      socialLinks,
    });

    // Save the new profile in the database
    await newStoreProfile.save();

    // Return the created profile
    console.log("newStoreProfile", newStoreProfile)
    res.status(200).json("Data saved in db", newStoreProfile);
  } catch (error) {
    console.error("Error creating store profile:", error);
    res.status(500).json({ error: "An error occurred while creating the store profile" });
  }
};
