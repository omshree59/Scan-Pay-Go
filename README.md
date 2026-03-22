# ⚡ ScanPay by ThinkStack

> **Equip Your Store for the Queue-less Future.** <br>
> A premium, high-performance B2B storefront and interactive e-commerce platform for the ScanPay hardware ecosystem.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 📖 About the Project

**ScanPay** (built by ThinkStack) is an autonomous retail ecosystem designed to eliminate checkout lines, cut staffing overhead by 40%, and turn every shopper's device into a secure, blazing-fast point of sale. 

This repository contains the frontend B2B storefront used to pitch, demonstrate, and sell the ScanPay ecosystem (Kiosks, Handheld Scanners, and the ThinkStack OS) to enterprise retailers. It is built with an extreme focus on performance, UI/UX, and conversion optimization.

### ✨ Key Features

* **Interactive 3D Hero:** Custom CSS 3D perspective mapping that tracks mouse movement in real-time.
* **Pure-Code SVG Hardware:** Highly detailed, animated SVGs mimicking the ScanPay Kiosk Pro and Handhelds without the need for heavy image assets.
* **Infinite Logo Marquee:** A seamless, CSS-masked social proof banner featuring top retail partners.
* **Premium Glassmorphism UI:** Dark-mode aesthetic with Aurora background glows, noise meshes, and buttery-smooth 60fps scrolling.
* **Multi-Step E-Commerce Cart:** A dynamic slide-out cart featuring an interactive checkout flow, sandbox payment processing simulation, and auto-generated order receipts.
* **Secure Authentication:** Integrated Google Login via Firebase Auth to manage B2B purchasing sessions.
* **Interactive Developer API Preview:** A mock code terminal showcasing the ease of integrating the `@thinkstack/os-sdk`.

---

## 🛠 Tech Stack

* **Core:** React.js + Vite
* **Styling:** Tailwind CSS (Custom configurations for Glassmorphism & Animations)
* **Icons:** Lucide React
* **Authentication:** Firebase Auth (Google Auth Provider)
* **Interactivity:** Custom React Hooks (`useRef`, `useMemo`), Intersection Observers, and CSS Transforms.

---

## 🚀 Getting Started

Follow these instructions to run the ScanPay storefront on your local machine.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone [https://github.com/your-username/scan-pay-go.git](https://github.com/your-username/scan-pay-go.git)
cd scan-pay-go
npm install