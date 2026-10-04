(() => {
  'use strict';

  // High-confidence profanity only.
  // Keep this list deliberately conservative to reduce false positives.
  const BLOCKED_WORDS = new Set([
    'FUCK', 'FUCKED', 'FUCKER', 'FUCKERS', 'FUCKING',
    'MOTHERFUCKER', 'MOTHERFUCKERS',
    'SHIT', 'SHITS', 'SHITTY', 'BULLSHIT', 'DIPSHIT',
    'BITCH', 'BITCHES',
    'BASTARD', 'BASTARDS',
    'CUNT', 'CUNTS',
    'DICK', 'DICKS', 'DICKHEAD', 'DICKHEADS',
    'COCK', 'COCKS',
    'PUSSY', 'PUSSIES',
    'WANK', 'WANKER', 'WANKERS', 'WANKING',
    'TWAT', 'TWATS',
    'ARSEHOLE', 'ARSEHOLES',
    'ASSHOLE', 'ASSHOLES',
    'BOLLOCKS',
    'PRICK', 'PRICKS',
    'SLUT', 'SLUTS',
    'WHORE', 'WHORES'
  ]);

  const BLOCKED_PHRASES = new Set([
    'FUCK OFF',
    'GO FUCK YOURSELF',
    'FUCK YOU',
    'SUCK MY DICK',
    'SUCK MY COCK'
  ]);

  const LEET_MAP = {
    '0': 'O',
    '1': 'I',
    '3': 'E',
    '4': 'A',
    '5': 'S',
    '7': 'T'
  };

  function canonical(value) {
    return String(value || '')
      .toUpperCase()
      .replace(/[013457]/g, (char) => LEET_MAP[char] || char)
      .replace(/[^A-Z\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compactCandidates(value) {
    const clean = canonical(value);
    const tokens = clean.split(' ').filter(Boolean);
    const candidates = new Set(tokens);

    // Catch simple punctuation-separated obfuscation such as f.u.c.k.
    for (let start = 0; start < tokens.length; start += 1) {
      let joined = '';
      for (let end = start; end < Math.min(tokens.length, start + 8); end += 1) {
        joined += tokens[end];
        if (joined.length >= 4) candidates.add(joined);
      }
    }

    return { clean, candidates };
  }

  function check(value) {
    const { clean, candidates } = compactCandidates(value);
    if (!clean) return { blocked: false };

    if (BLOCKED_PHRASES.has(clean)) {
      return { blocked: true, reason: 'phrase' };
    }

    for (const word of BLOCKED_WORDS) {
      if (candidates.has(word)) {
        return { blocked: true, reason: 'word' };
      }
    }

    return { blocked: false };
  }

  window.SignMyWordModeration = Object.freeze({ check });
})();
