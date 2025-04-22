import React from "react";




class ReusableFunctions {


   static calculateTaxRate(unitPrice, unitTax, unitQuantity) {
       if (!unitPrice || unitPrice <= 0) return 0;
    
       const tempTax = unitTax / unitQuantity;
       const taxRate = (tempTax / unitPrice) * 100;
      //  console.log("Tax Rate: ", taxRate);
       return parseFloat(taxRate.toFixed(2)); // Return percentage with 2 decimal places
     }
}




export default ReusableFunctions;



