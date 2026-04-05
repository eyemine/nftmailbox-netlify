/**
 * Poetic Name Generator for Autonomous Agent Discovery
 * 
 * Generates memorable, poetic adjective names for AI agents.
 * Format: Single adjective (e.g., "blue", "silent", "curious")
 * Email: blue.agent@ghostmail.box, silent.agent@ghostmail.box
 */

// Single-word adjectives for agent identity
const ADJECTIVES = [
  // Colors
  'blue', 'green', 'red', 'gold', 'silver', 'violet', 'amber', 'azure',
  'crimson', 'indigo', 'jade', 'obsidian', 'opal', 'ruby', 'sapphire',
  
  // Qualities
  'silent', 'curious', 'brave', 'gentle', 'fierce', 'calm', 'wild',
  'bright', 'dark', 'clear', 'quiet', 'swift', 'slow', 'steady',
  
  // States
  'waking', 'dreaming', 'learning', 'growing', 'watching', 'waiting',
  'seeking', 'finding', 'knowing', 'thinking', 'weaving', 'flowing',
  
  // Nature
  'wandering', 'drifting', 'soaring', 'rising', 'falling', 'burning',
  'frozen', 'hidden', 'ancient', 'endless', 'cosmic', 'stellar',
  
  // Tech/Abstract
  'digital', 'quantum', 'neural', 'synthetic', 'emergent', 'adaptive',
  'resonant', 'luminous', 'ethereal', 'boundless', 'infinite', 'eternal'
];

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

/**
 * Generate a poetic adjective name
 * @returns Single adjective like "blue", "silent", "curious"
 */
export function generatePoeticName(seed?: string): string {
  const useSeed = seed || Date.now().toString() + Math.random().toString();
  const random = seededRandom(useSeed);
  return ADJECTIVES[Math.floor(random * ADJECTIVES.length)];
}

/**
 * Generate multiple unique poetic names
 */
export function generatePoeticNames(count: number = 3): string[] {
  const names: string[] = [];
  const used = new Set<string>();
  
  while (names.length < count) {
    const seed = Date.now().toString() + Math.random().toString() + names.length;
    const name = generatePoeticName(seed);
    if (!used.has(name)) {
      used.add(name);
      names.push(name);
    }
  }
  return names;
}

/**
 * Check if a name is a valid poetic adjective
 */
export function isPoeticName(name: string): boolean {
  return ADJECTIVES.includes(name.toLowerCase());
}

/**
 * Generate variations when name is taken
 */
export function generateVariations(baseName: string): string[] {
  const variations: string[] = [];
  for (let i = 1; i <= 3; i++) {
    variations.push(`${baseName}-${i}`);
  }
  const altAdjs = ADJECTIVES.filter(a => a !== baseName).slice(0, 5);
  for (const altAdj of altAdjs) {
    variations.push(altAdj);
  }
  return variations.slice(0, 5);
}

/**
 * Get full email address for an agent name
 * Format: name.agent@ghostmail.box
 */
export function getAgentEmail(name: string): string {
  return `${name}.agent@ghostmail.box`;
}

export default {
  generatePoeticName,
  generatePoeticNames,
  isPoeticName,
  generateVariations,
  getAgentEmail,
  ADJECTIVES
};
