import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    // Return original email or a default if format is invalid
    return email;
  }
  const parts = email.split('@');
  const localPart = parts[0]; // Part before the '@'
  const domainPart = '@' + parts[1]; // Part from '@' to the end

  if (localPart.length === 0) {
    return email; // Handle cases with an empty local part
  }

  const firstLetter = localPart[0]; // Get the first letter
  let maskedLocalPart = firstLetter + '*****'; // Start with first letter and asterisks
  // Check if the local part ends with a digit
  const lastCharOfLocalPart = localPart[localPart.length - 1];

  if (/\d/.test(lastCharOfLocalPart)) { // Regex to check if character is a digit
    maskedLocalPart += lastCharOfLocalPart; // Append the last digit if it exists
  }

  return maskedLocalPart + domainPart; // Combine masked local part with domain
}

export const maskText = (text) => {
  if (!text || text.length <= 7) {
    // If the text is null, empty, or too short to mask (e.g., less than 7 digits for 3+4 pattern)
    // return the text as is or handle as an error.
    return text;
  }
  const firstThree = text.substring(0, 3);
  const lastFour = text.substring(text.length - 4);
  const stars = '*'.repeat(text.length - 7); // Calculate the number of stars needed
  return `${firstThree}${stars}${lastFour}`;
};

export const getEditAction = (type) => {
  switch (type) {
    case 'NIN': return 'edit-nin';
    case 'BVN': return 'edit-bvn';
    case 'PASSPORT': return 'edit-passport';
    case 'DRIVERS_LICENSE': return 'edit-drivers-license';
    case 'VOTERS_CARD': return 'edit-voters-card';
    default: return 'edit-other';
  }
};

export const KYC_TIER_DOCUMENTS = {
  tier_1: [
    { id: 'nin_placeholder', type: 'NIN', label: 'National Identity Number (NIN)' },
    { id: 'bvn_placeholder', type: 'BVN', label: 'Bank Verification Number (BVN)' },
  ],
  tier_2_additional: [
    { id: 'dl_placeholder', type: 'Driver\'s License', label: 'Driver\'s License' },
    { id: 'pp_placeholder', type: 'International Passport', label: 'International Passport' },
    { id: 'vin_placeholder', type: 'Voter\'s ID', label: 'Voter\'s ID' },
  ],
  tier_3_additional: [
    { id: 'address_placeholder', type: 'Utility Bill', label: 'Address verification' },
  ]
};
export const ALL_REQUIRED_DOCUMENT_TYPES = [
  ...KYC_TIER_DOCUMENTS.tier_1.map(d => d.type),
  ...KYC_TIER_DOCUMENTS.tier_2_additional.map(d => d.type),
  ...KYC_TIER_DOCUMENTS.tier_3_additional.map(d => d.type),
];
