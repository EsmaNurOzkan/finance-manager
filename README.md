# Finance Manager Project

This project consists of two main parts:

- **client/** — React Native Expo-based mobile application  
- **server/** — Node.js backend API

---

## Client (Mobile Application) — Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)  
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)  
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)  
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo  

⚠️ **This is a mobile application, so some features may not work properly in a web browser. Please test the app using Expo Go, an Android Emulator, or an iOS Simulator.**

---

## Server (Backend API) — Getting Started

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

---

## Project Structure

```
/client     # React Native application code  
/server     # Backend API code  
```

---

## Additional Notes

- Make sure your backend server is running before testing features in the client app that require API calls.
- Update environment variables (e.g., `.env` files) as needed for database connections and API keys.

---

Feel free to contribute or raise issues if you encounter any problems or have suggestions!
