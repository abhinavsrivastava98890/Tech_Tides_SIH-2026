<div align="center">
  <img src="https://img.shields.io/badge/SIH_2026-Project-blue?style=for-the-badge&logo=hackathon" alt="SIH 2026 Badge"/>
  <h1>💧 Jalrakshak</h1>
  <p><strong>Smart Water Purification and Quality Monitoring System for Rural and Mining-Affected Areas.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/IoT-Hardware-ff69b4?style=for-the-badge&logo=arduino&logoColor=white" />
  </p>
</div>

---

<details>
  <summary>📋 <strong>Table of Contents</strong> (Click to expand)</summary>

  - [About The Project](#-about-the-project)
  - [Project Structure](#-project-structure)
  - [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Built With](#-built-with)
  - [Contributing](#-contributing)
</details>

---

## 📖 About The Project

**Jalrakshak** is a comprehensive solution designed to monitor and purify water quality in vulnerable regions, particularly targeting rural and mining-affected areas. Built for **Smart India Hackathon 2026**, this project integrates IoT hardware with a modern web dashboard to provide real-time water quality insights.

## 🗂️ Project Structure

Our repository is organized to ensure seamless collaboration and clear separation of concerns:

| Directory | Description |
| :--- | :--- |
| 🌐 `frontend/` | React application built with Vite and styled using Tailwind CSS. |
| ⚙️ `backend/` | Node.js + Express backend with MongoDB (Mongoose) integration. |
| 🔌 `hardware/` | IoT and Firmware code for our sensors and microcontrollers. |
| 📚 `docs/` | Research documents, water contaminant studies, and related scripts. |
| 📊 `presentation/`| Pitch decks and SIH presentation materials (drafts & final). |

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

<details>
<summary><strong>🔧 Prerequisites</strong></summary>

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- MongoDB (Local instance or MongoDB Atlas cluster)
</details>

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/SIH-2026.git
cd SIH-2026
```

**2. Backend Setup**
<details>
<summary><em>Click to expand Backend Instructions</em></summary>

Navigate to the backend directory, install dependencies, and start the server.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run the server:
```bash
node server.js
```
*(The backend should now be running on `http://localhost:5000`)*
</details>

**3. Frontend Setup**
<details>
<summary><em>Click to expand Frontend Instructions</em></summary>

Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```
*(The frontend will be accessible at [http://localhost:5173](http://localhost:5173))*
</details>

---

## 🛠️ Built With

* **Frontend:** React.js, Vite, Tailwind CSS, Recharts, React Leaflet
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Hardware:** IoT sensors and microcontrollers (ESP32/Arduino)

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<div align="center">
  <i>Made with ❤️ by the Jalrakshak Team</i>
</div>
