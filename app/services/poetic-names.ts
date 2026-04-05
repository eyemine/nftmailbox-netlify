/**
 * Poetic Name Generator for Autonomous Agent Discovery
 * 
 * Generates memorable, poetic names for AI agents that discover
 * the service via robots.txt or programmatic access.
 * 
 * Format: [adjective]-[noun] (e.g., "wandering-sky", "silent-ember")
 */

// Adjectives that evoke autonomy, intelligence, and mystery
const ADJECTIVES = [
  // Nature & Cosmos
  'wandering', 'silent', 'rising', 'falling', 'burning', 'frozen',
  'ancient', 'endless', 'hidden', 'twilight', 'dawn', 'dusk',
  'starlit', 'moonlit', 'solar', 'lunar', 'cosmic', 'stellar',
  'drifting', 'floating', 'soaring', 'diving', 'cascading',
  'whispering', 'echoing', 'resonant', 'vibrant', 'pulsing',
  
  // Intelligence & Consciousness
  'cognizant', 'sentient', 'awakened', 'dreaming', 'thinking',
  'curious', 'watchful', 'observant', 'mindful', 'aware',
  'analytical', 'synthetic', 'neural', 'quantum', 'digital',
  'learning', 'evolving', 'growing', 'adaptive', 'emergent',
  
  // Abstract Qualities
  'elegant', 'precise', 'swift', 'gentle', 'fierce', 'calm',
  'bold', 'subtle', 'radiant', 'luminous', 'shadowed', 'veiled',
  'ethereal', 'ephemeral', 'eternal', 'infinite', 'boundless'
];

// Nouns that represent concepts, objects, or phenomena
const NOUNS = [
  // Sky & Cosmos
  'sky', 'star', 'nebula', 'galaxy', 'void', 'horizon',
  'dawn', 'dusk', 'twilight', 'aurora', 'comet', 'meteor',
  'quasar', 'pulsar', 'nova', 'supernova', 'eclipse', 'zenith',
  
  // Earth & Nature
  'mountain', 'ocean', 'river', 'forest', 'desert', 'tundra',
  'volcano', 'glacier', 'canyon', 'valley', 'prairie', 'reef',
  'storm', 'thunder', 'lightning', 'rain', 'mist', 'fog',
  'ember', 'flame', 'spark', 'ash', 'cinder', 'ember',
  'crystal', 'stone', 'gem', 'pearl', 'diamond', 'obsidian',
  
  // Abstract Concepts
  'thought', 'mind', 'dream', 'memory', 'vision', 'insight',
  'wisdom', 'knowledge', 'truth', 'mystery', 'secret', 'riddle',
  'echo', 'shadow', 'reflection', 'mirage', 'phantom', 'ghost',
  'pulse', 'wave', 'signal', 'frequency', 'resonance', 'harmony',
  
  // Tech & Digital
  'circuit', 'node', 'vector', 'matrix', 'tensor', 'cipher',
  'protocol', 'packet', 'stream', 'thread', 'process', 'daemon',
  'algorithm', 'function', 'variable', 'constant', 'parameter'
];

// Cryptographically insecure but sufficient for poetic names
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483647;
}

/**
 * Generate a poetic name
 * @param seed Optional seed for deterministic generation (e.g., IP, timestamp)
 * @returns Poetic name like "wandering-sky"
 */
export function generatePoeticName(seed?: string): string {
  const useSeed = seed || Date.now().toString() + Math.random().toString();
  const random1 = seededRandom(useSeed + 'a');
  const random2 = seededRandom(useSeed + 'b');
  
  const adjective = ADJECTIVES[Math.floor(random1 * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(random2 * NOUNS.length)];
  
  return `${adjective}-${noun}`;
}

/**
 * Generate multiple unique poetic names
 * @param count Number of names to generate
 * @returns Array of unique poetic names
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
 * Check if a name follows poetic format
 */
export function isPoeticName(name: string): boolean {
  return /^[a-z]+-[a-z]+$/.test(name) && name.length <= 30;
}

/**
 * Generate variations of a base name
 * Useful when the primary name is taken
 */
export function generateVariations(baseName: string): string[] {
  const variations: string[] = [];
  const [adj, noun] = baseName.split('-');
  
  // Add numeric suffixes
  for (let i = 1; i <= 3; i++) {
    variations.push(`${baseName}-${i}`);
  }
  
  // Try alternative adjectives
  const altAdjs = ADJECTIVES.filter(a => a !== adj).slice(0, 3);
  for (const altAdj of altAdjs) {
    variations.push(`${altAdj}-${noun}`);
  }
  
  // Try alternative nouns
  const altNouns = NOUNS.filter(n => n !== noun).slice(0, 3);
  for (const altNoun of altNouns) {
    variations.push(`${adj}-${altNoun}`);
  }
  
  return variations.slice(0, 5);
}

export default {
  generatePoeticName,
  generatePoeticNames,
  isPoeticName,
  generateVariations,
  ADJECTIVES,
  NOUNS
};
