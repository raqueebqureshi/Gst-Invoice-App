import StoreProfile from "../Models/storeInfoModel.js";


// Update only boolean for sendByAppEmail
// Update only boolean for sendByAppEmail
export const changeTaxByApp = async (req, res) => {
  try {


  const { storeDomain } = req.query;
    const { shopId, taxChangeRequest } = req.body;


     
     console.log('req.body:',req.body);
    if (!shopId || taxChangeRequest === undefined) {
      return res.status(400).json({ error: "Shop ID and taxByApp are required." });
    }
     const updatedConfig = await StoreProfile.findOneAndUpdate(
      { shopId },
      { "taxes.isAppTax": taxChangeRequest },
      { new: true }
    );
     if (!updatedConfig) {
      return res.status(404).json({ error: "Tax setting not found for this shop." });
    }
     res.status(200).json({
      message: "Tax setting updated successfully.",
      updatedConfig: {
        shopId: updatedConfig.shopId,
        isAppTax: updatedConfig.taxes.isAppTax,
      },
    });
  } catch (error) {
    console.error("Error updating Tax setting:", error);
    res.status(500).json({ error: "An error occurred while updating the Tax setting." });
  }
};






 // Update only boolean for sendByAppEmail
export const changeIsTaxIncluded = async (req, res) => {
  try {
 
 
  const { storeDomain } = req.query;
    const { shopId, taxIncludedRequest } = req.body;
 
 
     
 
 
    console.log('req.body:',req.body);
    if (!shopId || taxIncludedRequest === undefined) {
      return res.status(400).json({ error: "Shop ID and taxByApp are required." });
    }
 
 
    const updatedConfig = await StoreProfile.findOneAndUpdate(
      { shopId },
      { "taxes.tax_includedOnProduct": taxIncludedRequest },
      { new: true }
    );
 
 
    if (!updatedConfig) {
      return res.status(404).json({ error: "Tax setting not found for this shop." });
    }
 
 
    res.status(200).json({
      message: "Tax setting updated successfully.",
      updatedConfig: {
        shopId: updatedConfig.shopId,
        tax_includedOnProduct: updatedConfig.taxes.tax_includedOnProduct,
      },
    });
  } catch (error) {
    console.error("Error updating Tax setting:", error);
    res.status(500).json({ error: "An error occurred while updating the Tax setting." });
  }
 };
 
 