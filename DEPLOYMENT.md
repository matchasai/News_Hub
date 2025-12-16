# NewsHub Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Install dependencies for both frontend and backend:**
```bash
npm install
cd server && npm install && cd ..
```

2. **Create environment files:**

   **`.env` (frontend)**
   ```
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

   **`server/.env` (backend)**
   ```
   GNEWS_API_KEY=your_gnews_api_key_here
   PORT=5000
   ```

   Get your free API key at: https://gnews.io

3. **Run both servers:**

   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

Visit: `http://localhost:5173`

---

## Deployment on Render (Full Stack)

### Option 1: Using `render.yaml` (Recommended)

1. Create a `render.yaml` at the project root:
   ```yaml
   services:
     - type: web
       name: newshub-backend
       env: node
       region: oregon
       plan: free
       buildCommand: cd server && npm install
       startCommand: cd server && npm start
       envVars:
         - key: GNEWS_API_KEY
           scope: run
           value: your_gnews_api_key
     
     - type: static_site
       name: newshub-frontend
       buildCommand: npm install && npm run build
       staticPublishPath: dist
       envVars:
         - key: VITE_BACKEND_URL
           value: https://newshub-backend.onrender.com/api
   ```

2. Push to GitHub and connect your repo to Render.
3. Render will auto-detect `render.yaml` and deploy both services.

### Option 2: Deploy Backend & Frontend Separately

**Backend:**
1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Settings:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment Variables:**
     - `GNEWS_API_KEY`: Your gnews.io API key
4. Deploy

**Frontend:**
1. Create a new Static Site on Render
2. Connect your GitHub repo
3. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_BACKEND_URL`: `https://your-backend-service.onrender.com/api`
4. Deploy

---

## Verify Deployment

Once deployed, test the backend health check:
```bash
curl https://your-backend-service.onrender.com/health
```

Should return:
```json
{"status": "ok", "message": "NewsHub backend is running"}
```

---

## Troubleshooting

**"Cannot GET /api/news/top-headlines"**
- Ensure backend is running and `VITE_BACKEND_URL` is set correctly in frontend

**"API Plan Limit Reached"**
- Upgrade your gnews.io plan or get a new free API key

**CORS still failing**
- Verify `cors()` middleware is enabled in `server/index.js`
- Check backend URL is correct in frontend `.env`

---

## Project Structure
```
news-mag/
├── server/                 # Express backend
│   ├── index.js           # API proxy server
│   ├── package.json
│   └── .env               # Backend secrets
├── src/                   # React frontend
│   ├── components/
│   ├── utils/
│   └── ...
├── .env                   # Frontend config
├── package.json
└── render.yaml            # Render deployment config
```
