# Airstrike

Airstrike is a lightweight FastAPI application that allows you to upload files to your machine via a web interface.  
I created this to imitate Apple's AirDrop in a simpler and open source way.  
**New:** You can now upload files from your PC and download them on your iPhone (two-way transfer).

---

## Features

- Multiple file upload via web interface  
- Upload progress bar  
- Console QR Code with LAN address  
- Button to shut down the server from the browser  
- Uploaded files saved locally in the `uploads/` folder  
- **PC → iPhone file transfer**: upload files on your PC and download them directly from your phone  

---

## Installation / Installazione

1. Clone the repository / Clona il repository:
   ```bash
   git clone https://github.com/Gianmarco0001/Airstrike.git
   cd Airstrike
   ```

2. Install dependencies / Installa le dipendenze:
   ```bash
   pip install -r requirements.txt
   ```

---

## Usage / Utilizzo

1. Start the server / Avvia il server:
   ```bash
   python app.py
   ```

2. A QR code will appear in your terminal / Verrà mostrato un QR code nel terminale.  
   Scan it with your phone or another device connected to the same Wi-Fi network / Scansiona il codice con il tuo telefono o un altro dispositivo connesso alla stessa rete Wi-Fi.

3. Open the provided URL in the browser / Apri l'URL fornito nel browser:  
   - Upload files from your iPhone or PC through the web interface / Carica file dal tuo iPhone o PC tramite l'interfaccia web.  
   - Track the upload progress / Segui la barra di avanzamento del caricamento.  
   - Click **"Chiudi connessione"** to shut down the server when done / Clicca su **"Chiudi connessione"** per spegnere il server quando hai finito.  
   - Download files uploaded from PC directly to your iPhone / Scarica i file caricati dal PC direttamente sul tuo iPhone.

Files are saved in the `uploads/` directory by default / I file verranno salvati di default nella cartella `uploads/`.

---

## ⚠ Disclaimer

Airstrike is a simple experimental project created **to imitate the behavior of AirDrop for educational purposes**.  
It is **not intended for production use** and does not include advanced security features.  
Use it only in trusted local networks.

Airstrike è un progetto sperimentale creato **per imitare il comportamento di AirDrop a scopo educativo**.  
Non è **destinato all'uso in produzione** e non include funzionalità avanzate di sicurezza.  
Usalo solo in reti locali fidate.

---

## License / Licenza

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  
Questo progetto è rilasciato sotto la **MIT License** – vedi il file [LICENSE](LICENSE) per i dettagli.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
