import { ModerationStatus } from '../types';

export interface ModerationResult {
  status: ModerationStatus;
  passed: boolean;
  reason?: string;
  flags: string[];
}

// Regular expressions for detecting sensitive personal information in India
const INDIAN_PHONE_REGEX = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/;
const AADHAAR_REGEX = /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/;
const CREDIT_CARD_REGEX = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13})\b/;
const IFSC_REGEX = /\b[A-Z]{4}0[A-Z0-9]{6}\b/;

// Spam and financial scam patterns
const SCAM_PATTERNS = [
  /earn\s+(?:rs\.?|inr|₹)?\s*\d{3,}\s*(?:daily|per\s*day|hourly)/i,
  /guaranteed\s+(?:profit|return|doubling|income)/i,
  /whatsapp\s+me\s+at/i,
  /dm\s+for\s+crypto/i,
  /telegram\s+(?:channel|link|group)\s*:/i,
  /click\s+here\s+to\s+claim\s+cash/i,
  /free\s+recharge\s+offer/i
];

// Severe abusive terms or hate speech
const HATE_SPEECH_PATTERNS = [
  /\bkill\s+yourself\b/i,
  /\bi\s+will\s+kill\s+you\b/i,
  /\bharm\s+them\b/i,
  /\bterrorist\s+scum\b/i
];

export function runContentModeration(title: string, content: string): ModerationResult {
  const combinedText = `${title} ${content}`.trim();
  const flags: string[] = [];

  // Check 1: Private personal information exposure (Critical privacy protection)
  if (INDIAN_PHONE_REGEX.test(combinedText)) {
    flags.push('Contains personal phone number');
  }

  if (AADHAAR_REGEX.test(combinedText)) {
    flags.push('Contains Aadhaar or government identity number');
  }

  if (CREDIT_CARD_REGEX.test(combinedText)) {
    flags.push('Contains credit or debit card number');
  }

  if (IFSC_REGEX.test(combinedText)) {
    flags.push('Contains bank IFSC or financial credentials');
  }

  // Check 2: Hate speech / violent threats
  for (const pattern of HATE_SPEECH_PATTERNS) {
    if (pattern.test(combinedText)) {
      flags.push('Violates community policy on threats and harassment');
      break;
    }
  }

  // Check 3: Scams and financial solicitation
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(combinedText)) {
      flags.push('Potential scam or suspicious financial promotion');
      break;
    }
  }

  if (flags.length === 0) {
    return {
      status: 'approved',
      passed: true,
      flags: []
    };
  }

  // If contains severe threats or multiple flags, reject or mark needs_review
  const isSevere = flags.some(f => f.includes('threats') || f.includes('scam'));
  const status: ModerationStatus = isSevere ? 'needs_review' : 'needs_review';

  return {
    status,
    passed: false,
    reason: flags.join('; '),
    flags
  };
}
