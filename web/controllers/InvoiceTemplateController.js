import InvoiceTemplate from "../Models/InvoiceTemplateModel.js";

// Controller to fetch template settings
export const getTemplateSettings = async (req, res) => {
    try {
        const { email, storeDomain } = req.body;   
      // Validate inputs
      if (!email || !storeDomain) {
        return res.status(400).json({ error: "Email and storeDomain are required" });
      }
  
      // Find the invoice template for the given email and store domain
      const template = await InvoiceTemplate.findOne({ email, storeDomain });
  
      if (!template) {
        return res.status(404).json({ error: "Template not found for the given email and store domain" });
      }
  
      // Respond with the template data
      res.status(200).json(template);
    } catch (error) {
      console.error("Error fetching template settings:", error);
      res.status(500).json({ error: "An error occurred while fetching the template settings" });
    }
  };
  
// Controller to update template settings
export const updateTemplateSettings = async (req, res) => {
  try {
    const { email, storeDomain, updatedSettings } = req.body;

    // Validate inputs
    if (!email || !storeDomain || !updatedSettings) {
      return res.status(400).json({ error: "Email, storeDomain, and updatedSettings are required" });
    }

    // Find and update the invoice template for the given email and store domain
    const template = await InvoiceTemplate.findOneAndUpdate(
      { email, storeDomain },
      { $set: updatedSettings },
      { new: true } // Return the updated document
    );

    if (!template) {
      return res.status(404).json({ error: "Template not found for the given email and store domain" });
    }

    // Respond with the updated template data
    res.status(200).json(template);
  } catch (error) {
    console.error("Error updating template settings:", error);
    res.status(500).json({ error: "An error occurred while updating the template settings" });
  }
};