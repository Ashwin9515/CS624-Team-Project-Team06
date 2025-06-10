# 📚 StudySync – TP03 Project Final Submission Report

## 🚀 Overview

**StudySync** is a mobile productivity app designed for students to manage their academic workload. Built with **React Native** using **Expo Router**, the app supports offline-first task tracking, a rule-based chatbot for study tips, a visual calendar for date-wise organization, and vibrant UI/UX styling for enhanced user experience.

Here's a comprehensive feature checklist for your StudySync app based on everything we've reviewed and implemented:

✅ COMPLETED FEATURES (Fully Functional)
🔐 Authentication
 Login / Register with JWT

 Auth token persisted via AsyncStorage

 Logout + token clearing

 Authenticated requests with token attached in Axios interceptor

📋 Tasks
 Add task (with offline queueing if offline)

 Edit task

 Delete task

 View all tasks

 Task list filters by calendar date (index.tsx + calendar integration)

 Status indicators for completed/incomplete

 Offline caching and reading from cache if network fails

🗓 Calendar
 Calendar view using react-native-calendars

 Dates marked with task completion status (multi-dot logic)

 Tap a day to filter tasks

⏱ Pomodoro Timer
 Circular countdown UI

 Work/break session logic with long break every 4th session

 Local session tracking

 Analytics logged to backend

 Offline persistence of timer preferences (AsyncStorage)

 Optional vibration and alerts

📊 Analytics
 Analytics dashboard showing:

Tasks completed

Pomodoro minutes

 Reads from backend

 Shows session data on Home screen

🤖 Chatbot
 Chat UI functional

 Messages sent/received

 Timestamps shown

 Chat saved per user in MongoDB

 Clear chat history button

⚙️ Settings
 Toggle for:

Notifications

Vibration

Long Breaks

 Edit Pomodoro durations

 Clear local cache

 Reset Pomodoro analytics

 Logout button

🧠 Offline Support
 Cached task read (AsyncStorage)

 Queued task creation

 Pomodoro preferences + sessions saved offline

 Settings/preferences saved offline

⏳ PARTIALLY IMPLEMENTED / FUTURE OPTIONS (Intentionally Skipped or Deferred)
Feature	Status	Notes
Offline Edit/Delete of Tasks	⏳ Not Needed	Currently network-only. Queueing would require conflict resolution.
Push Notifications	⏳ Planned	Toggle exists, but actual scheduling via expo-notifications not setup
Chatbot model improvements	⏳ Planned	Current bot is simple – AI upgrades (e.g., Gemma or Phi-2 via Ollama) are pending
UI/UX Animation Enhancements	⏳ Optional	Transitions, gestures, or haptics can be added later if needed
User testing / Accessibility	⏳ External	Suggested by feedback; requires real-world user feedback & adjustments

📌 FINAL SCORECARD
Category	Status
Core Features	✅ 100% Done
Offline Functionality	✅ 95% (Add only)
Advanced UX/AI	⏳ Deferred
Backend Integration	✅ Complete

## 💻 Tech Stack

- **Frontend**: React Native (Expo)
- **Navigation**: Expo Router
- **Local Storage**: AsyncStorage
- **Calendar**: `react-native-calendars`
- **Backend (Optional)**: Node.js, Express, MongoDB Atlas
- **Dev Environment**: GitHub Codespaces

---

## 👨‍💻 Team Contributions

| Team Member              | Contributions                                               |
|--------------------------|-------------------------------------------------------------|
| Ashwin Shastry Paturi    | Chatbot integration, navigation structure, calendar screen  |
| Vidyasagar Neerudi       | Task CRUD, AsyncStorage persistence, backend API setup      |
| Chandrahasa Munagala     | UI design, component styling, Home screen, README/Docs      |

Weekly updates and detailed roles are tracked in the MEETINGS.md file, which will be updated soon.

---

## 📎 Setup Instructions

1. **Install dependencies**  
   ```bash
   npm install
   ```

2. **Start the app (in Codespaces or locally)**  
   ```bash
   npx expo start --tunnel
   ```

3. **Install Calendar dependency**  
   ```bash
   npx expo install react-native-calendars
   ```

4. *(Optional)* For backend support, run the MERN API from `/studysync-server` with:
   ```bash
   npm install
   npm run dev
   ```

---

## 📌 Remaining Work

- Push notification system
- UI polish and device testing
- Finalize backend deployment
- Demo video and final presentation slides
- Optional: Upgrade chatbot to use **Gemma AI** via Ollama server

---

## 🔗 Resources

- [Project GitHub Repository](https://github.com/Ashwin9515/CS624-Team-Project-Team06)
- [Backend Repository](/workspaces/CS624-Team-Project-Team06/studysync-server)