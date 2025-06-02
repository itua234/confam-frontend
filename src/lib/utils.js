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
