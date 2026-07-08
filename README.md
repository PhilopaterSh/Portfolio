# Philopater Shenouda - Professional Cybersecurity Portfolio

[![GitHub Stars](https://img.shields.io/github/stars/PhilopaterSh/Portfolio?style=flat-square)](https://github.com/PhilopaterSh/Portfolio/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/PhilopaterSh/Portfolio?style=flat-square)](https://github.com/PhilopaterSh/Portfolio/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

This is a high-performance personal portfolio website built with **React 19**, **TypeScript**, and **Vite 7**. It showcases my expertise in penetration testing, vulnerability analysis, and security research.

---

## 🚀 Latest Feature: Cybersecurity Awareness Hub

I have integrated a dedicated section for **Cybersecurity Awareness** to empower users with essential security knowledge and interactive tools.

### 🛡️ Interactive Password Entropy Lab

A core part of the awareness hub is the **Password Entropy Lab**, inspired by my Password Entropy project.

**Key Features:**

- **Real-time Entropy Calculation:** Measures password strength in bits using mathematical entropy formulas ($log_2(L^N)$).
- **Smart Security Ratings:** Provides instant feedback ranging from "Very Weak" to "Mathematically Secure".
- **Expert Recommendations:** Dynamic suggestions to improve password diversity (length, casing, numbers, and symbols).
- **Secure Password Generator:** Generates cryptographically strong 16-character passwords using `window.crypto`.
- **One-Click Copy:** Seamlessly copy generated passwords to your clipboard with visual feedback.

### 🌐 Network Identity Trace (Where am I?)

A new reconnaissance simulation tool designed to demonstrate how much information is publicly exposed by a user's network connection.

**Key Features:**

- **Dual-Step Recon:** Replicates the exact logic of my Python-based tracking scripts, fetching the public IP via `ipify` and mapping geographical data via `ipapi.co`.
- **Comprehensive Data Display:** Reveals Public IP, City, Region, Country, Postal Code, Timezone, and ISP (Internet Service Provider).
- **Privacy Resilience Testing:** Acts as a benchmark to test the effectiveness of VPNs, Ad-Blockers, and browser privacy settings.
- **Simulation Mode:** Includes a "Demo Mode" for users with high-security browser configurations that block external tracking APIs, ensuring the UI can still be evaluated.
- **Educational Context:** Provides a clear explanation of why this data is accessible and how it relates to digital footprint awareness.

### 🧠 Understanding Password Entropy

Password entropy is a measure of how unpredictable and resistant a password is to being guessed or cracked. It quantifies the strength of a password in terms of its randomness and complexity, typically expressed in bits. Higher entropy indicates a stronger password that is harder for hackers to break using methods like brute force, dictionary attacks, or social engineering.

#### 📐 Formula for Password Entropy

The formula for calculating password entropy is:

$$E = \log_2(R^L)$$

- **E:** Password entropy (in bits).
- **R:** The number of possible characters in the password's character set (e.g., 26 for lowercase letters, 62 for alphanumeric characters, etc.).
- **L:** The length of the password.

_For example, a password with 8 characters using uppercase, lowercase, numbers, and special symbols (R = 94) would have an entropy of approximately 52.6 bits._

#### 🛡️ Enhancing Password Entropy

To increase password entropy:

- **Use diverse character sets:** Include uppercase and lowercase letters, numbers, and special characters.
- **Increase password length:** Longer passwords exponentially increase entropy.
- **Avoid predictable patterns:** Avoid dictionary words, repeated characters, or sequences like "1234" or "abcd."

#### 📋 Practical Guidelines

A password with an entropy score of 60 bits or higher is generally considered strong. However, it’s essential to balance complexity with memorability to avoid users resorting to insecure practices like writing passwords down.

**For example:**

- A password like `P@ssw0rd123!` has higher entropy than `password123`.
- A randomly generated password such as `X9@kL#7q` is even stronger but may be harder to remember.

Password entropy is a critical concept in cybersecurity, helping individuals and organizations create robust defenses against unauthorized access.

---

## ✨ Professional UI/UX & Architectural Enhancements

In addition to the Awareness Hub, the portfolio has been upgraded with several professional-grade features:

### 🌗 Global Theme System & Navigation

- **Integrated Theme Switcher:** A sophisticated navigation bar featuring a real-time **Light / Dark / System** mode toggle, preserved across all pages via `ThemeContext`.
- **Adaptive Mobile Navigation:** A fully responsive **Hamburger Menu** system designed for seamless mobile browsing.
  - **Interactive Toggle:** Smooth CSS-animated transition from a three-bar icon to a close (X) button.
  - **Side Drawer:** A modern, blur-effect side menu that slides in on mobile devices (width < 900px).
  - **Intelligent Auto-Close:** Navigation links automatically close the mobile menu upon selection for a fluid user experience.
- **Seamless Navigation:** A unified `nav-container` with smooth-scrolling anchors for the Home page and direct routing to the Awareness Hub.

### 📸 Dynamic Testimonials Slider

- **High-Volume Gallery:** An automated, responsive slider showcasing **11+ professional testimonials** and success screenshots.
- **Interactive Controls:** Pagination dots for manual navigation combined with intelligent auto-slide logic for a modern "alive" feel.

### 🏗️ Optimized Asset Architecture

- **Performance-First Structure:** Migrated all critical images (Education, Experience, Testimonials) to `src/assets/` to leverage Vite's build-time optimization and hashing.
- **Logical Organization:** Cleanly categorized subdirectories for better codebase maintainability.

---

## 🛠️ Technical Stack

- **Frontend:** React 19 (Functional Components & Hooks)
- **Language:** TypeScript (Strict typing for security and reliability)
- **Routing:** React Router Dom (Client-side navigation)
- **Build Tool:** Vite 7 (Fast HMR and optimized production builds)
- **Styling:** Modern CSS (Neon/Dark aesthetic tailored for Cybersecurity)

---

## 📂 Project Structure

- `src/pages/Home.tsx`: The main landing page showcasing experience, projects, and certifications.
- `src/pages/CybersecurityAwareness.tsx`: The interactive security education hub.
- `src/App.tsx`: Main application entry point with configured routing.
- `public/`: Optimized assets including education logos and testimonials.

---

## ⚙️ Development & Deployment

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/PhilopaterSh/Portfolio.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Production Build

To create an optimized production build:

```bash
npm run build
```

---

## 👨‍💻 About the Developer

**Philopater Shenouda** - Penetration Tester | Cybersecurity Engineer

Passionate about ethical hacking, network security, and building tools that make the digital world safer.

- **GitHub:** [PhilopaterSh](https://github.com/PhilopaterSh)
- **LinkedIn:** [Philopater Shenouda](https://linkedin.com/in/philopater-shenouda)

---

© 2026 PHILOPATER SHENOUDA SEDKIY. ALL SYSTEMS SECURE.
