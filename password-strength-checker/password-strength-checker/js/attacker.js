// ==========================================
// attacker.js — Dictionary & Brute-force attack simulator
// ==========================================

// Common password dictionary (educational list)
const DICTIONARY = [
  "password","123456","qwerty","abc123","letmein","monkey","dragon",
  "master","sunshine","princess","welcome","shadow","admin","pass",
  "hello","iloveyou","superman","batman","starwars","football","baseball",
  "soccer","login","access","mustang","michael","jessica","password1",
  "password123","123456789","1234567890","passw0rd","p@ssword","p@$$word",
  "qwerty123","111111","000000","1234","test","root","user","guest",
  "default","temp","12345","asdfgh","zxcvbn","trustno1","donald",
  "jennifer","charlie","thomas","letmein1","pass123","hello123","abc1234"
];

// Characters used in brute-force
const BRUTE_CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789';

// State
let currentTab  = 'dict';
let attackRunning = false;
let cancelAttack  = false;

/** Switch between dictionary and brute-force tab */
function setTab(t) {
  currentTab = t;
  document.getElementById('tabDict').className  = 'tab' + (t === 'dict'  ? ' active' : '');
  document.getElementById('tabBrute').className = 'tab' + (t === 'brute' ? ' active' : '');
}

/** Add a line to the attack log */
function logLine(text, cls = '') {
  const log  = document.getElementById('attackLog');
  const line = document.createElement('div');
  line.className = 'log-line ' + cls;
  line.textContent = text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

/** Clear the attack log */
function clearLog() {
  document.getElementById('attackLog').innerHTML = '';
}

/** Update stats counters */
function updateStats(tried, startTime) {
  const elapsed = (Date.now() - startTime) / 1000 || 1;
  document.getElementById('sTried').textContent = tried;
  document.getElementById('sRate').textContent  = Math.round(tried / elapsed);
}

/** Main attack runner */
async function runAttack() {
  // Stop a running attack
  if (attackRunning) {
    cancelAttack = true;
    return;
  }

  const pw = document.getElementById('pwInput').value;
  if (!pw) {
    clearLog();
    logLine('[!] Please enter a password first.', 'log-fail');
    return;
  }

  // Reset UI
  attackRunning = true;
  cancelAttack  = false;
  document.getElementById('runBtn').textContent = '⏹ Stop Attack';
  document.getElementById('sTried').textContent  = '0';
  document.getElementById('sRate').textContent   = '0';
  document.getElementById('sResult').textContent = '—';
  document.getElementById('progFill').style.width = '0%';
  clearLog();

  const start = Date.now();
  let tried = 0;
  let found = false;

  // ── Dictionary Attack ──────────────────────────────────────
  if (currentTab === 'dict') {
    logLine('[*] Starting dictionary attack (' + DICTIONARY.length + ' words)...');

    for (let i = 0; i < DICTIONARY.length; i++) {
      if (cancelAttack) break;

      // Yield to browser every iteration so UI stays responsive
      await new Promise(r => setTimeout(r, 20));

      tried++;
      const word = DICTIONARY[i];
      const pct  = Math.round((i / DICTIONARY.length) * 100);
      document.getElementById('progFill').style.width = pct + '%';
      updateStats(tried, start);
      logLine('[' + tried + '] Trying: ' + word);

      if (word === pw) {
        logLine('[+] PASSWORD CRACKED! → "' + word + '"', 'log-found');
        document.getElementById('sResult').textContent = 'CRACKED ✓';
        found = true;
        break;
      }
    }

    if (!found && !cancelAttack)
      logLine('[-] Not found in dictionary. Password is not common.', 'log-fail');

  // ── Brute-Force Attack ─────────────────────────────────────
  } else {
    // Cap brute-force at length 4 to keep it fast in the browser
    const maxLen = Math.min(pw.length, 4);
    logLine('[*] Starting brute-force (charset: a-z, 0-9, up to ' + maxLen + ' chars)...');

    outerLoop:
    for (let len = 1; len <= maxLen; len++) {
      logLine('[*] Trying length ' + len + '...');
      const total = Math.pow(BRUTE_CHARSET.length, len);

      for (let n = 0; n < total; n++) {
        if (cancelAttack) break outerLoop;

        // Yield every 200 iterations
        if (n % 200 === 0) await new Promise(r => setTimeout(r, 0));

        tried++;

        // Build the candidate string
        let guess = '';
        let t = n;
        for (let p = 0; p < len; p++) {
          guess = BRUTE_CHARSET[t % BRUTE_CHARSET.length] + guess;
          t = Math.floor(t / BRUTE_CHARSET.length);
        }

        document.getElementById('progFill').style.width =
          Math.round((n / total) * 100) + '%';
        updateStats(tried, start);

        // Log every 50th attempt to avoid flooding the UI
        if (n % 50 === 0) logLine('[' + tried + '] Trying: ' + guess);

        if (guess === pw) {
          logLine('[+] PASSWORD CRACKED! → "' + guess + '"', 'log-found');
          document.getElementById('sResult').textContent = 'CRACKED ✓';
          found = true;
          break outerLoop;
        }
      }
    }

    if (!found && !cancelAttack) {
      logLine(
        '[-] Not cracked within brute-force range (password too complex or too long).',
        'log-fail'
      );
      document.getElementById('sResult').textContent = 'NOT FOUND';
    }
  }

  // Cleanup
  if (cancelAttack) logLine('[x] Attack stopped by user.');
  document.getElementById('progFill').style.width = '100%';
  attackRunning = false;
  document.getElementById('runBtn').textContent = '▶ Run Attack';
}
