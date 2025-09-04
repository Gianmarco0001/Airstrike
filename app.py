from fastapi import FastAPI, Request, UploadFile, File, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import uvicorn
import socket
import qrcode
import time

APP_NAME = "Airstrike"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
STATIC_FOLDER = os.path.join(BASE_DIR, "static")
TEMPLATES_FOLDER = os.path.join(BASE_DIR, "templates")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title=APP_NAME)

app.mount("/static", StaticFiles(directory=STATIC_FOLDER), name="static")
templates = Jinja2Templates(directory=TEMPLATES_FOLDER)

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def print_qr(url):
    qr = qrcode.QRCode(border=1)
    qr.add_data(url)
    qr.make(fit=True)
    qr.print_ascii(invert=True)
    print(f"\nServer URL: {url}\n")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    local_ip = get_local_ip()
    server_url = f"http://{local_ip}:5000"
    return templates.TemplateResponse("index.html", {
        "request": request,
        "server_url": server_url,
        "app_name": APP_NAME
    })

# Upload dei file
@app.post("/upload")
async def upload(files: list[UploadFile] = File(...)):
    saved_files = []
    total = len(files)
    start_time = time.time()

    for idx, file in enumerate(files, start=1):
        file_location = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_location, "wb") as f:
            while True:
                chunk = await file.read(1024 * 1024)  # 1MB alla volta
                if not chunk:
                    break
                f.write(chunk)

        saved_files.append(file.filename)

        progress = int((idx / total) * 100)
        bar = "#" * (progress // 2)

        elapsed = time.time() - start_time
        avg_time_per_file = elapsed / idx
        remaining_files = total - idx
        remaining_time = int(avg_time_per_file * remaining_files)

        print(f"Caricamento: [{bar:<50}] {progress}% | File {idx}/{total} | Tempo stimato rimanente: {remaining_time}s", flush=True)

    return {"filenames": saved_files, "status": "success"}

@app.get("/files")
async def list_files():
    files = os.listdir(UPLOAD_FOLDER)
    return JSONResponse(content={"files": files})

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename, media_type="application/octet-stream")
    return {"error": "File non trovato"}

@app.post("/shutdown")
async def shutdown(background_tasks: BackgroundTasks):
    def stop():
        os._exit(0)  # forza chiusura del processo uvicorn
    background_tasks.add_task(stop)
    return {"status": "Server in chiusura..."}

if __name__ == "__main__":
    local_ip = get_local_ip()
    server_url = f"http://{local_ip}:5000"
    print_qr(server_url)
    print(">>> Avvio uvicorn...")
    uvicorn.run("app:app", host="0.0.0.0", port=5000, log_level="debug")
