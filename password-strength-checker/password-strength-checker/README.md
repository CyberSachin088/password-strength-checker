# 🔐 Password Strength Checker + Hash Cracker

A beginner-friendly cybersecurity project built with pure HTML, CSS, and JavaScript — no frameworks, no backend required.

Live Demo: *(add your GitHub Pages link here after deploying)*

---

## 📸 Features

| Feature | Description |
|---|---|
| **Password Strength Analyzer** | Scores your password across 6 criteria with a visual strength bar |
| **Entropy Calculator** | Calculates bits of entropy and estimates crack time |
| **Hash Generator** | Generates MD5, SHA-1, and SHA-256 hashes in real time |
| **Dictionary Attack Simulator** | Checks if your password appears in a list of common passwords |
| **Brute-Force Attack Simulator** | Tries all combinations up to a set length with live progress |

---

## 📁 Project Structure

```
password-strength-checker/
│
├── index.html          ← Main HTML page
├── css/
│   └── style.css       ← All styling (dark GitHub theme)
├── js/
│   ├── hashing.js      ← MD5, SHA-1, SHA-256 implementations
│   ├── strength.js     ← Password scoring, entropy, crack time
│   ├── attacker.js     ← Dictionary & brute-force attack logic
│   └── main.js         ← Entry point, event listeners
└── README.md
```

---

## 🚀 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/password-strength-checker.git
   ```

2. Open `index.html` in your browser — that's it! No server needed.

---

## 🌐 Deploy on GitHub Pages (Free Hosting)

1. Push this project to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Click **Save** — your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/password-strength-checker/
   ```

---

## 🧠 Concepts You Learn From This Project

- **Password entropy** — how randomness makes passwords harder to crack
- **Hashing algorithms** — MD5, SHA-1 (broken), SHA-256 (secure)
- **Dictionary attacks** — using wordlists to guess common passwords
- **Brute-force attacks** — systematically trying all combinations
- **DOM manipulation** — updating the UI dynamically with JavaScript
- **Async/await** — using the Web Crypto API for SHA-256

---

## ⚠️ Disclaimer

This project is for **educational purposes only**. The attack simulations run entirely in your browser and do not connect to any external service. Never use these techniques on systems you do not own or have explicit permission to test.

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Web Crypto API (for SHA-256)

---

## 📌 Future Improvements (Ideas)

- [ ] Add Have I Been Pwned API integration
- [ ] Support longer dictionary files (fetch from `.txt`)
- [ ] Add rainbow table simulation
- [ ] Export results as PDF report
- [ ] Add more hash algorithms (SHA-512, bcrypt demo)

---

Made with ❤️ for learning cybersecurity fundamentals.
