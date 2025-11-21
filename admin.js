document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = document.getElementById('admin-dashboard');
    const dataForm = document.getElementById('data-form');
    
    loadDashboard();

    function loadDashboard() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                window.currentData = data;
                generateForm(data);
            });
    }

    function generateForm(data) {
        let formHtml = '';
        
        // Hero Section
        formHtml += '<h3>Hero Section</h3>';
        for (const key in data.hero) {
            formHtml += createField(`hero_${key}`, `Hero ${key}`, data.hero[key]);
        }

        // Events Section
        formHtml += '<h3>Events</h3>';
        data.events.forEach((event, index) => {
            formHtml += `<h4>Event ${index + 1}</h4>`;
            for (const key in event) {
                formHtml += createField(`event_${index}_${key}`, `Event ${index + 1} ${key}`, event[key]);
            }
        });
        
        // Gallery Section
        formHtml += '<h3>Gallery</h3>';
        data.gallery.forEach((src, index) => {
            formHtml += createField(`gallery_${index}`, `Gallery Image ${index + 1}`, src);
        });

        const existingButton = dataForm.querySelector('button');
        if(existingButton) existingButton.remove();

        dataForm.innerHTML = formHtml;

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'btn-admin';
        saveButton.textContent = 'Télécharger le fichier data.json mis à jour';
        dataForm.appendChild(saveButton);
    }

    function createField(id, label, value) {
        return `
            <div class="form-group">
                <label for="${id}">${label}</label>
                <input type="text" id="${id}" value="${value}">
            </div>
        `;
    }

    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedData = JSON.parse(JSON.stringify(window.currentData));

        for (const key in updatedData.hero) {
            updatedData.hero[key] = document.getElementById(`hero_${key}`).value;
        }

        updatedData.events.forEach((event, index) => {
            for (const key in event) {
                const value = document.getElementById(`event_${index}_${key}`).value;
                // Preserve number type for price
                event[key] = key === 'price' ? Number(value) : value;
            }
        });

        updatedData.gallery.forEach((src, index) => {
            updatedData.gallery[index] = document.getElementById(`gallery_${index}`).value;
        });
        
        const dataStr = JSON.stringify(updatedData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Le fichier data.json a été téléchargé. Remplacez l\\'ancien fichier par celui-ci pour appliquer les modifications.');
    });
});
