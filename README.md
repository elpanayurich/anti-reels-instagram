# 📱 Anti-Reels-Instagram

A custom iOS "shell" for the Instagram webapp designed for **iPhone 14**. This project uses a React Native WebView to load Instagram while injecting a powerful, persistent JavaScript "shield" that removes distractions (reels), ads, suggested posts and restores user control.

---

## ✨ Features (The "Shield")

This app isn't just a wrapper; it's an automated extension that modifies Instagram in real-time:

*   **🚫 Total Ad-Block:** Surgical removal of "Ad," "Publicidad," "Sponsored," and "Suggested" posts from your feed.
*   **🎬 Reels-Free Experience:** The Reels tab is hidden from the navigation bar, and Reels "preview" units are nuked from the feed.
*   **👥 Strictly Following:** Automatically redirects you to the "Following" feed on startup and whenever you return to the home screen.
*   **🔍 Clean Search:** The Search/Explore page is stripped of its "infinite distraction" grid, leaving only the functional search bar.
*   **📽️ Inline Video:** Forces all videos to play inside the feed rather than launching the native iOS fullscreen player.

---

## 🏗️ Technical Architecture

*   **Framework:** React Native + Expo (SDK 51+).
*   **Core Component:** `react-native-webview`.
*   **Injection Strategy:** A 400ms recursive "Shield" loop that monitors the DOM for Instagram's dynamic UI changes.
*   **Spoofing:** Identifies as **Safari on iPhone (iOS 16)** to ensure the most optimized mobile layout.

---

## 📲 Installation & Deployment Guide

Follow these steps to install and keep the app on your device using Expo Go.

### 1. Install Expo Go
*   Download the **Expo Go** app from the iOS App Store or Google Play Store.
*   Create a free account at [expo.dev](https://expo.dev) if you haven't already.

### 2. Local Testing
*   Open your terminal in the project directory.
*   Run `npx expo start`.
*   Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android).
*   Your custom Instagram will load instantly!

### 3. "Install" Forever (Production Deployment)
To keep the app available on your device without needing your computer running:
*   Make sure you are logged into your Expo account in the terminal: `npx expo login`.
*   Run the following command to push the app to the production branch:
    ```bash
    eas update --branch production --message "Installing version"
    ```
*   Once the update is finished, open **Expo Go** on your phone.
*   Go to the **"Projects"** tab. You will see your project there.
*   Open it from the **"Production"** branch or **"Recent Updates"**.
*   Now you have it available anytime directly from Expo Go!

---

## 🛠️ Modifying the App
To add or change features (like hiding "Suggested Accounts"):
1.  Open `App.js`.
2.  Modify the `shieldJS` logic.
3.  Test locally, then run the `eas update` command again to push the changes to your phone.

---

