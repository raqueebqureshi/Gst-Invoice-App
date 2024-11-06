import { toWords } from 'number-to-words';

export default function convertAmountToWords(amount) {
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let result = `${toWords(integerPart)} Rupees`;
  if (decimalPart > 0) {
    result += ` and ${toWords(decimalPart)} Paise`;
  }

  return result.charAt(0).toUpperCase() + result.slice(1) + " Only";
}

// // Example usage
// const amount = 1129.50;
// console.log(convertAmountToWords(amount));  // Output: "One thousand one hundred twenty-nine rupees and fifty paise only"
