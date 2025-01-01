import StoreProfile from "../Models/StoreProfileModel.js";

export const createStoreProfile = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      email,
      storeDomain,
      firstName,
      lastName,
      brandColor,
      invoiceNumber,
      invoicePrefix,
      brandName,
      phone,
      storeEmail,
      websiteURL,
      gstNumber,
      logoURL,
      signatureURL,
      address,
      apartment,
      city,
      postalCode,
      country,
      facebookURL,
      xURL,
      instagramURL,
      pinterestURL,
      youtubeURL,
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
      storeProfile: {
        firstName,
        lastName,
        brandColor,
        invoiceNumber,
        invoicePrefix,
        brandName,
        phone,
        storeEmail,
        websiteURL,
        gstNumber,
      },
      images: {
        logoURL,
        signatureURL,
      },
      addresses: {
        address,
        apartment,
        city,
        postalCode,
        country,
      },
      socialLinks: {
        facebookURL,
        xURL,
        instagramURL,
        pinterestURL,
        youtubeURL,
      },
    });

    // Save the new profile in the database
    await newStoreProfile.save();

    // Return the created profile
    res.status(201).json(newStoreProfile);
  } catch (error) {
    console.error("Error creating store profile:", error);
    res.status(500).json({ error: "An error occurred while creating the store profile" });
  }
};
