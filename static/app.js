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

    const formData = new FormData();
    for (let file of files) {
        formData.append("files", file);
    }

    progressContainer.style.display = "block";
    progressBar.style.width = "0%";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressBar.style.width = percentComplete + "%";
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            statusDiv.innerHTML = `File caricati: ${result.filenames.join(", ")}`;
            progressBar.style.width = "100%";
        } else {
            statusDiv.innerHTML = "Errore durante l'upload!";
        }
    };

    xhr.send(formData);
});

// Bottone per chiudere il server
const shutdownBtn = document.getElementById("shutdownBtn");
shutdownBtn.addEventListener("click", async () => {
    await fetch("/shutdown", { method: "POST" });
    alert("Server chiuso. Chiudi questa finestra.");
});
