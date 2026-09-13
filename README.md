# Jalrakshak - SIH 2026

**Smart Water Purification and Quality Monitoring System for Rural and Mining-Affected Areas.**

This project is a comprehensive solution designed to monitor and purify water quality in vulnerable regions.

## Project Structure
The repository is divided into main parts:
- `backend/`: Node.js + Express backend with MongoDB (Mongoose) integration.
- `frontend/`: React application built with Vite and styled using Tailwind CSS.
- `hardware/`: IoT and Firmware code.
- `docs/`: Research documents and related scripts.
- `presentation/`: Pitch decks and SIH presentation materials.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine after cloning.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SIH-2026.git
cd SIH-2026
```

### 2. Backend Setup
Navigate to the backend directory, install the required dependencies, and start the backend server.

```bash
cd backend
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend/` directory and configure the necessary environment variables. Example:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

**Run the Backend:**
If there are no specific scripts in `package.json`, you can run the server directly:
```bash
node server.js
```
*(The backend should now be running on `http://localhost:5000`)*

### 3. Frontend Setup
Open a new terminal window or tab, navigate to the frontend directory, install dependencies, and start the Vite development server.

```bash
cd frontend
npm install
```

**Environment Variables:**
If your frontend needs to connect to the backend, create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

**Run the Frontend:**
```bash
npm run dev
```

The frontend will typically be accessible at [http://localhost:5173](http://localhost:5173).

---

## Built With
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, React Leaflet
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, dotenv, cors

## Contributing
Please follow standard git workflow: create a feature branch, commit your changes with detailed messages, and create a pull request.
