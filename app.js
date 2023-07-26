// Fonction pour afficher les informations de l'image
function showImageInfo(imageSrc) {
    // Créer une nouvelle instance de l'objet Image
    let image = new Image();

    // Définir le chemin de l'image
    image.src = imageSrc;

    // Afficher l'image dans la page HTML
    let imageDropped = document.getElementById('imageDropped');
    imageDropped.src = imageSrc;

    // Charger l'image avant de lire les métadonnées
    image.onload = function () {
        // Récupérer la taille de l'image
        let imageWidth = image.width;
        let imageHeight = image.height;

        // Récupérer le type de fichier de l'image (Il n'y a pas de propriété 'type' dans l'objet Image)
        // Pour récupérer le type de fichier de l'image, vous pouvez extraire l'extension du nom de fichier à partir de l'URL de l'image.
        let imageType = image.src.split('.').pop(); // Cela récupérera l'extension (par exemple: "jpg")

        // Lire les métadonnées Exif de l'image pour obtenir les informations GPS
        EXIF.getData(image, function () {
            let gpsData = EXIF.getTag(this, 'GPSLatitude');
            let latitudeRef = EXIF.getTag(this, 'GPSLatitudeRef');
            let gpsDataLongitude = EXIF.getTag(this, 'GPSLongitude');
            let longitudeRef = EXIF.getTag(this, 'GPSLongitudeRef');

            let metadata = EXIF.getAllTags(this);
            console.log(metadata);

            displayMetadataTable(metadata, imageWidth, imageHeight);


            // Vérifier si les données GPS sont disponibles
            if (gpsData && gpsDataLongitude && latitudeRef && longitudeRef) {
                // Calculer les coordonnées GPS
                let latitude = gpsData[0] + gpsData[1] / 60 + gpsData[2] / 3600;
                let longitude = gpsDataLongitude[0] + gpsDataLongitude[1] / 60 + gpsDataLongitude[2] / 3600;
                if (latitudeRef === 'S') {
                    latitude = -latitude;
                }
                if (longitudeRef === 'W') {
                    longitude = -longitude;
                }

                // Afficher les informations dans la console
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            } else {
                console.log("Les informations GPS ne sont pas disponibles pour cette image.");
            }

            // Afficher d'autres informations dans la console
            console.log(`Largeur: ${imageWidth}, Hauteur: ${imageHeight}`);
        });
    };
}


function displayMetadataTable(metadata, imageWidth, imageHeight) {
    let tableBody = document.getElementById('metadataTableBody');
    tableBody.innerHTML = '';

    if (Object.keys(metadata).length === 0)
    {
        tableBody.innerHTML = '<h2> Aucune métadonnée disponible </h2>'
    }
    else {
        let json = {
            "Appareil": metadata.Make,
            "Modèle": metadata.Model,
            "Logiciel": metadata.Software,
            "Date de prise de vue": metadata.DateTimeOriginal,
            "Logiciel": metadata.Software,
            "Taille de l'image": `${imageWidth} x ${imageHeight}`,
            "Type de fichier": `${metadata.thumbnail.blob.type}`,
            "Vitesse d'obturation": metadata.ExposureTime,
            "Balance des blancs": metadata.WhiteBalance,
            "Ouverture": metadata.FNumber,
            "Sensibilité ISO": metadata.ISOSpeedRatings,
            "Distance focale": metadata.FocalLength,
            "Flash": metadata.Flash,
            "Latitude": metadata.GPSLatitude,
            "Longitude": metadata.GPSLongitude,
            "Altitude": metadata.GPSAltitude,
            "Orientation": metadata.Orientation,
        }
    
        for (let key in json) {
    
            if (json[key] !== undefined) {
    
                let row = `<tr><td>${key}</td><td>${json[key]}</td></tr>`;
                tableBody.innerHTML += row;
            }
        }
    }
}




// Fonction pour gérer le glisser-déposer d'une image
function handleDrop(e) {
    e.preventDefault();

    if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
            if (e.dataTransfer.items[i].kind === 'file') {
                let file = e.dataTransfer.items[i].getAsFile();
                handleFile(file);
            }
        }
    }
}



// Fonction pour gérer la sélection de fichier à partir de l'explorateur de fichiers
function handleFile(file) {
    let reader = new FileReader();

    reader.onload = function (event) {
        let imageSrc = event.target.result;
        showImageInfo(imageSrc);
    };

    reader.readAsDataURL(file);
}



// Empêcher le comportement par défaut pour le glisser-déposer
function handleDragOver(e) {
    e.preventDefault();
}



// Ajouter des gestionnaires d'événements pour le glisser-déposer
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('drop', handleDrop);


// Gérer le clic sur le bouton de sélection de fichier
const fileInput = document.getElementById('fileInput');
dropZone.addEventListener('click', function () {
    fileInput.click();
});


// Gérer la sélection de fichier à partir de l'explorateur de fichiers
fileInput.addEventListener('change', function (e) {
    let file = e.target.files[0];
    handleFile(file);
});