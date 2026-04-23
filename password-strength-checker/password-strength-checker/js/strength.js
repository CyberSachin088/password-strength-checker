// ==========================================
// strength.js — Password strength analysis
// ==========================================

/**
 * Calculate the entropy of a password in bits.
 * Entropy = length × log2(pool_size)
 * Pool size depends on which character sets are used.
 */
function calcEntropy(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  if (pool === 0) return 0;
  return Math.round(pw.length * Math.log2(pool));
}

/**
 * Estimate how long it would take to brute-force the password
 * assuming 1 billion guesses per second (modern GPU speed).
 */
function crackTimeStr(entropy) {
  const guesses = Math.pow(2, entropy);
  const guessesPerSec = 1e9; // 1 billion/sec
  const secs = guesses / guessesPerSec;

  if (secs < 1)           return 'instantly';
  if (secs < 60)          return Math.round(secs) + ' seconds';
  if (secs < 3600)        return Math.round(secs / 60) + ' minutes';
  if (secs < 86400)       return Math.round(secs / 3600) + ' hours';
  if (secs < 31536000)    return Math.round(secs / 86400) + ' days';
  if (secs < 3.15e10)     return Math.round(secs / 31536000) + ' years';
  return 'centuries';
}

/**
 * Returns a strength score 0–6 based on password criteria.
 * Each passing check adds 1 point.
 */
function scorePassword(pw) {
  const checks = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^a-zA-Z0-9]/.test(pw),
    pw.length >= 12,
  ];
  return checks;
}

// Color and label maps for each strength level
const STRENGTH_COLORS = ['#f85149', '#f85149', '#e3b341', '#e3b341', '#3fb950', '#3fb950'];
const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Moderate', 'Strong', 'Very Strong'];

/**
 * Update the UI: strength bar, dots, entropy badge, crack time.
 */
async function updateStrengthUI(pw) {
  const checks = scorePassword(pw);
  const score = checks.filter(Boolean).length;

  // Update check dots
  for (let i = 0; i < 6; i++) {
    document.getElementById('c' + (i + 1)).className = 'dot' + (checks[i] ? ' ok' : '');
  }

  // Update strength bar
  const pct = pw ? Math.round((score / 6) * 100) : 0;
  const fill = document.getElementById('barFill');
  fill.style.width = pct + '%';
  fill.style.background = pw ? (STRENGTH_COLORS[score - 1] || '#3fb950') : 'transparent';

  // Update label
  const label = document.getElementById('strengthLabel');
  label.textContent = pw ? (STRENGTH_LABELS[score - 1] || 'Very Strong') : '—';
  label.style.color = pw ? (STRENGTH_COLORS[score - 1] || '#3fb950') : '#8b949e';

  // Update entropy badge
  const ent = calcEntropy(pw);
  const badge = document.getElementById('entropyBadge');
  badge.textContent = pw ? 'entropy: ' + ent + ' bits' : 'entropy: — bits';

  // Update crack time
  const ct = document.getElementById('crackTime');
  ct.textContent = pw
    ? '⏱ Estimated crack time (at 1B guesses/sec): ' + crackTimeStr(ent)
    : '';

  // Update hashes
  await updateHashUI(pw);
}

/**
 * Generate and display hashes for a given password.
 */
async function updateHashUI(pw) {
  const container = document.getElementById('hashRows');
  if (!pw) {
    container.innerHTML = '<p class="muted">Enter a password above to generate hashes.</p>';
    return;
  }

  const h256 = await sha256(pw);
  const hmd5  = md5(pw);
  const h1    = sha1(pw);

  const rows = [
    ['MD5 (broken)', hmd5],
    ['SHA-1 (broken)', h1],
    ['SHA-256', h256],
  ];

  container.innerHTML = rows.map(([lbl, val]) => `
    <div class="hash-row">
      <span class="hash-label">${lbl}</span>
      <span class="hash-val">${val}</span>
      <button class="copy-btn" onclick="copyHash('${val}', this)">Copy</button>
    </div>
  `).join('');
}

/**
 * Copy a hash to clipboard and briefly change button text.
 */
function copyHash(val, btn) {
  navigator.clipboard.writeText(val).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}
