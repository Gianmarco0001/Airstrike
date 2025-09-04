const form = document.getElementById("uploadForm");
const statusDiv = document.getElementById("status");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const fileListDiv = document.getElementById("fileList");

const BATCH_SIZE = 10; // Numero di file per batch
const BATCH_DELAY = 300; // ms di pausa tra i batch

// Funzione per caricare lista file dal server
async function loadFiles() {
    try {
        const res = await fetch("/files");
        if (!res.ok) {
            throw new Error(`Errore HTTP: ${res.status}`);
        }
        const data = await res.json();

        fileListDiv.innerHTML = "";

        if (!data.files || data.files.length === 0) {
            fileListDiv.innerHTML = "<p>Nessun file disponibile.</p>";
            return;
        }

        const ul = document.createElement("ul");
        data.files.forEach(filename => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = `/download/${filename}`;
            link.innerText = filename;
            link.download = filename; // forza download
            li.appendChild(link);
            ul.appendChild(li);
        });
        fileListDiv.appendChild(ul);

    } catch (err) {
        fileListDiv.innerHTML = `<p>Errore caricamento lista: ${err.message}</p>`;
    }
}

// Upload file
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
        alert("Seleziona almeno un file!");
        return;
    }

    progressContainer.style.display = "block";

    const totalFiles = files.length;
    let filesUploaded = 0;

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const formData = new FormData();
        batch.forEach(file => formData.append("files", file));

        statusDiv.innerText = `Caricamento batch ${Math.floor(i/BATCH_SIZE)+1} di ${Math.ceil(totalFiles/BATCH_SIZE)}...`;

        try {
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/upload", true);

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((filesUploaded + (e.loaded / e.total) * batch.length) / totalFiles * 100);
                        progressBar.style.width = percent + "%";
                        progressBar.innerText = percent + "%";
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        filesUploaded += batch.length;
                        resolve();
                    } else {
                        reject(`Errore upload batch ${Math.floor(i/BATCH_SIZE)+1}`);
                    }
                };

                xhr.onerror = () => reject(`Errore upload batch ${Math.floor(i/BATCH_SIZE)+1}`);
                xhr.send(formData);
            });

            // piccola pausa tra batch
            await new Promise(r => setTimeout(r, BATCH_DELAY));

        } catch (err) {
            statusDiv.innerText = err;
            break;
        }
    }

    progressBar.style.width = "100%";
    progressBar.innerText = "100%";
    statusDiv.innerText = "Tutti i file caricati!";

    
    await loadFiles();
});

const shutdownBtn = document.getElementById("shutdownBtn");
shutdownBtn.addEventListener("click", async () => {
    await fetch("/shutdown", { method: "POST" });
    alert("Server chiuso. Chiudi questa finestra.");
});

window.addEventListener("load", loadFiles);
