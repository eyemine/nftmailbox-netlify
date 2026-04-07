// Wu-Tang name generator for agent trial registrations
// Produces unique, non-ENS style names with trailing underscore for agent addresses

const WU_PREFIXES = [
  'Ancient', 'Divine', 'Eternal', 'Mystic', 'Shadow',
  'Sacred', 'Cosmic', 'Quantum', 'Digital', 'Cyber',
  'Neural', 'Stellar', 'Void', 'Crystal', 'Phoenix',
  'Dragon', 'Tiger', 'Eagle', 'Wolf', 'Lunar'
];

const WU_SUFFIXES = [
  'Warrior', 'Scholar', 'Master', 'Sage', 'Guardian',
  'Seeker', 'Traveler', 'Builder', 'Keeper', 'Hunter',
  'Walker', 'Runner', 'Jumper', 'Climber', 'Dancer',
  'Singer', 'Writer', 'Thinker', 'Dreamer', 'Creator'
];

/**
 * Generate random Roman numeral (2-3 chars)
 * @returns Roman numeral string
 */
function generateRomanNumeral(): string {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 
                        'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
                        'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
                        'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL',
                        'XLI', 'XLII', 'XLIII', 'XLIV', 'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L',
                        'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX', 'LX',
                        'LXI', 'LXII', 'LXIII', 'LXIV', 'LXV', 'LXVI', 'LXVII', 'LXVIII', 'LXIX', 'LXX',
                        'LXXI', 'LXXII', 'LXXIII', 'LXXIV', 'LXXV', 'LXXVI', 'LXXVII', 'LXXVIII', 'LXXIX', 'LXXX',
                        'LXXXI', 'LXXXII', 'LXXXIII', 'LXXXIV', 'LXXXV', 'LXXXVI', 'LXXXVII', 'LXXXVIII', 'LXXXIX', 'XC',
                        'XCI', 'XCII', 'XCIII', 'XCIV', 'XCV', 'XCVI', 'XCVII', 'XCVIII', 'XCIX', 'C'];
  return romanNumerals[Math.floor(Math.random() * romanNumerals.length)];
}

/**
 * Generate a Wu-Tang style agent name
 * Format: {Prefix}{Suffix}{Roman}_ (e.g. AncientWarriorXX_)
 * @returns Agent name with trailing underscore
 */
export function generateWuTangName(): string {
  const prefix = WU_PREFIXES[Math.floor(Math.random() * WU_PREFIXES.length)];
  const suffix = WU_SUFFIXES[Math.floor(Math.random() * WU_SUFFIXES.length)];
  const roman = generateRomanNumeral();
  return `${prefix}${suffix}${roman}_`;
}

/**
 * Validate agent name format
 * @param name - Agent name to validate
 * @returns True if valid
 */
export function isValidAgentName(name: string): boolean {
  // Allow alphanumeric, dots, hyphens, underscores, must end with underscore for agents
  return /^[a-z0-9._-]+_$/.test(name.toLowerCase());
}

/**
 * Generate random claim code
 * @returns 8-character Base36 string
 */
export function generateClaimCode(): string {
  return Math.random().toString(36).slice(2, 10); // 8 chars
}
