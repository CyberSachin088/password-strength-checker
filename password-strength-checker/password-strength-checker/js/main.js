// ==========================================
// main.js — Entry point, event listeners
// ==========================================

document.getElementById('pwInput').addEventListener('input', function () {
  const pw = this.value;

  // Update target info for attacker panel
  document.getElementById('targetInfo').textContent = pw
    ? 'Target set. Run an attack below to simulate cracking.'
    : 'Set a password above, then run an attack.';

  // Run strength + hash update
  updateStrengthUI(pw);
});
