const form = document.getElementById("uploadForm");
const statusDiv = document.getElementById("status");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;
    if (files.length === 0) {
        alert("Seleziona almeno un file!");
        return;
    }

    progressContainer.style.display = "block";

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("files", file);

        progressBar.style.width = "0%";
        progressBar.innerText = "0%";
        statusDiv.innerText = `Caricamento ${i+1} di ${files.length}: ${file.name}`;

        try {
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/upload", true);

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100);
                        progressBar.style.width = percentComplete + "%";
                        progressBar.innerText = percentComplete + "%";
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve();
                    } else {
                        reject(`Errore su ${file.name}`);
                    }
                };

                xhr.onerror = () => reject(`Errore su ${file.name}`);
                xhr.send(formData);
            });
        } catch (err) {
            statusDiv.innerText = err;
            break;
        }
    }

    statusDiv.innerText = "Tutti i file caricati!";
    progressBar.style.width = "100%";
    progressBar.innerText = "100%";
});

// Bottone per chiudere il server
const shutdownBtn = document.getElementById("shutdownBtn");
shutdownBtn.addEventListener("click", async () => {
    await fetch("/shutdown", { method: "POST" });
    alert("Server chiuso. Chiudi questa finestra.");
});
