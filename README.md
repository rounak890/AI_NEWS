# **AI News Aggregator**  

I created this repository to assist community owners who struggle daily to find and curate the latest AI news using AI tools. This repetitive process consumes a lot of time, so I built this project to automate the workflow.  

✨ **It fetches and delivers AI news every 24 hours.**  

---

## 🚀 **Upcoming Features**  
- 🔗 **WhatsApp/Telegram/Discord Integration**  
- 📊 **Dashboard Functionality**  
- 🔑 **Google Authentication System**  
- 📰 **News Formatting for Better Readability**  

---

## 📌 **Usage Guide**  

### **Backend Setup**  
1. Clone the repository.  
2. Create a file named **`.env`** in the root directory.  
3. Add your credentials:  
   ```ini
   API_KEY = "<your API key>"
   EMAIL = "<your email>"
   MAIL_PASSWORD = "<your email passkey>"
   ```  
4. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```  
5. Run the backend server using FastAPI or Uvicorn:  
   - **FastAPI:**  
     ```bash
     fastapi dev app.py
     ```  
   - **Uvicorn:**  
     ```bash
     uvicorn app:app --host 127.0.0.1 --port 5662
     ```  

---

### **Frontend Setup**  
1. Navigate to the `frontend` folder:  
   ```bash
   cd frontend
   ```  
2. Create a **`.env`** file and add the following:  
   ```ini
   VITE_SUPABASE_URL=""
   VITE_SUPABASE_ANON_KEY=""
   VITE_API_BASE_URL=""
   VITE_APP_API_BASE_URL=""
   ```  
3. Install dependencies:  
   ```bash
   npm install
   ```  
4. Start the frontend server:  
   ```bash
   npm run dev
   ```  

---

## 🎥 **Live Demonstration**  

### **Landing Page**  
![Home image](image.png)  

### **Registration Page**  
![Registration form](image-1.png)  

### **Daily AI News Feed (Updated Every 24 Hours)**  
![Today's AI news](image-2.png)  

---
