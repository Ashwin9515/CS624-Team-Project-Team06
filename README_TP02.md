# 📚 StudySync – TP02 Project Progress Report

## 🚀 Overview

**StudySync** is a mobile productivity app designed for students to manage their academic workload. Built with **React Native** using **Expo Router**, the app supports offline-first task tracking, a rule-based chatbot for study tips, a visual calendar for date-wise organization, and vibrant UI/UX styling for enhanced user experience.

This README documents the project status for **TP02**, covering the features completed, technologies used, collaboration strategies, and implementation roadmap.

---

## 🧩 Key Features Implemented

- ✅ **Task Management (CRUD)**  
  Add, view, update, and delete tasks with title, subject, due date, and priority.

- ✅ **Persistent Local Storage**  
  All task data is saved using `AsyncStorage`, ensuring offline support.

- ✅ **Rule-Based Chatbot**  
  A local chatbot provides motivational study tips and answers academic productivity queries.

- ✅ **Calendar View**  
  In-app calendar using `react-native-calendars` allows students to visualize tasks by due date.

- ✅ **Component-Based UI**  
  Reusable components like `TaskCard` and `MessageBubble` enhance consistency and design.

- ✅ **Scalable Backend Option**  
  A MERN stack backend (Node.js + MongoDB Atlas) is implemented as a future enhancement path for cloud-based syncing.

---

## 🧠 TP01 Feedback Response

- **🔔 Notifications & Reminders**  
  We’ve laid the foundation for reminders by emphasizing due dates and calendar visuals. Push notifications via `expo-notifications` are planned for TP03.

- **🔐 Data Privacy Practices**  
  The app uses local storage by default and does not collect or transmit user data. Optional backend mode handles only non-sensitive metadata with plans for encryption and secure communication in the future.

---

## 🗂 Screens & Navigation

| Screen        | Description                                          |
|---------------|------------------------------------------------------|
| `HomeScreen`  | Entry point with navigation buttons to core features |
| `TasksScreen` | List of all tasks with editable entries              |
| `AddTask`     | Form to add or update a task                         |
| `Calendar`    | View tasks by due date using interactive calendar    |
| `Chatbot`     | Interact with a study-focused rule-based assistant   |

Navigation is implemented using folder-based routing via **Expo Router**.

---

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
| [Teammate 2 Name]        | Task CRUD, AsyncStorage persistence, backend API setup      |
| [Teammate 3 Name]        | UI design, component styling, Home screen, README/Docs      |

Weekly updates and detailed roles are tracked in [`MEETINGS.md`](./MEETINGS.md).

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

- [Project GitHub Repository](https://github.com/your-team/studysync)
- [Backend Repository](https://github.com/your-team/studysync-server)