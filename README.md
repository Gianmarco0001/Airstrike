# Airstrike
Airstrike is a lightweight FastAPI application that allows you to upload files to your machine via a web interface. 
I created this to imitate the Apple's AirDrop but in a simpler and open source way.

---

##  Features
- Multiple file upload via web interface  
- Upload progress bar  
- Console QR Code with LAN address  
- Button to shut down the server from the browser  
- Uploaded files saved locally in the `uploads/` folder  

##  Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/airstrike.git
   cd airstrike
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

##  Usage

1. Start the server:
   ```bash
   python app.py
   ```

2. A QR code will appear in your terminal.  
   Scan it with your phone or another device connected to the same Wi-Fi network.

3. Open the provided URL in the browser.  
   - Upload files through the web interface.  
   - Track the upload progress.  
   - Click **"Chiudi connessione"** to shut down the server when done.

 Files are saved in the `uploads/` directory by default.

---

## ⚠ Disclaimer

Airstrike is a simple experimental project created **to imitate the behavior of AirDrop for educational purposes**.  
It is **not intended for production use** and does not include advanced security features.  
Use it only in trusted local networks.

---

##  License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
