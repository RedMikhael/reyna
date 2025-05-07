document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');
    const imageContainer = document.getElementById('imageContainer');
    const titleInput = document.getElementById('titleInput');

    // Load existing images from Firestore
    function loadImages() {
        db.collection('gallery').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const title = data.title;
                const caption = data.caption;
                const imageURL = data.imageURL;

                const galleryItem = document.createElement('div');
                galleryItem.classList.add('gallery-item');

                const titleElem = document.createElement('h3');
                titleElem.textContent = title;
                titleElem.style.textAlign = 'center';

                const img = document.createElement('img');
                img.src = imageURL;
                img.alt = caption;
                img.classList.add('gallery-image');

                const captionElem = document.createElement('p');
                captionElem.textContent = caption;

                // Create the delete button
                const deleteBtn = document.createElement('span');
                deleteBtn.textContent = '×';
                deleteBtn.classList.add('delete-btn');

                deleteBtn.addEventListener('click', function () {
                    const confirmation = prompt("Type the special password to delete this image:");
                    if (confirmation && confirmation.toLowerCase().trim() === 'vladimir is the key') {
                        doc.ref.delete(); // Delete image from Firestore
                        galleryItem.remove(); // Remove image from gallery
                    } else {
                        alert("Incorrect key. Deletion cancelled.");
                    }
                });

                galleryItem.appendChild(deleteBtn);
                galleryItem.appendChild(img);
                galleryItem.appendChild(titleElem);
                galleryItem.appendChild(captionElem);

                imageContainer.appendChild(galleryItem);

                // Image click for modal zoom and drag functionality
                img.addEventListener('click', function () {
                    const modal = document.createElement('div');
                    modal.classList.add('modal-overlay');
                
                    const enlargedImg = document.createElement('img');
                    enlargedImg.src = img.src;
                    enlargedImg.alt = img.alt;
                    enlargedImg.style.transform = 'scale(1)';
                    enlargedImg.style.cursor = 'grab';
                
                    let scale = 1;
                    let isDragging = false;
                    let startX, startY;
                    let translateX = 0, translateY = 0;
                
                    // ESC key handler
                    function escHandler(e) {
                        if (e.key === 'Escape') {
                            modal.remove();
                            document.removeEventListener('keydown', escHandler);
                        }
                    }
                
                    // Zoom handling
                    modal.addEventListener('wheel', (e) => {
                        e.preventDefault();
                        scale += e.deltaY * -0.001;
                        scale = Math.min(Math.max(0.5, scale), 5);
                        updateTransform();
                    });
                
                    // Drag start
                    enlargedImg.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        isDragging = true;
                        startX = e.clientX - translateX;
                        startY = e.clientY - translateY;
                        enlargedImg.style.cursor = 'grabbing';
                    });
                
                    // Drag move
                    modal.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;
                        translateX = e.clientX - startX;
                        translateY = e.clientY - startY;
                        updateTransform();
                    });
                
                    // Drag end
                    modal.addEventListener('mouseup', () => {
                        isDragging = false;
                        enlargedImg.style.cursor = 'grab';
                    });
                
                    modal.addEventListener('mouseleave', () => {
                        isDragging = false;
                        enlargedImg.style.cursor = 'grab';
                    });
                
                    // Touch support
                    enlargedImg.addEventListener('touchstart', (e) => {
                        if (e.touches.length === 1) {
                            isDragging = true;
                            startX = e.touches[0].clientX - translateX;
                            startY = e.touches[0].clientY - translateY;
                        }
                    });
                
                    modal.addEventListener('touchmove', (e) => {
                        if (!isDragging || e.touches.length !== 1) return;
                        translateX = e.touches[0].clientX - startX;
                        translateY = e.touches[0].clientY - startY;
                        updateTransform();
                    });
                
                    modal.addEventListener('touchend', () => {
                        isDragging = false;
                    });
                
                    function updateTransform() {
                        enlargedImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
                    }
                
                    // Prevent click from closing modal
                    enlargedImg.addEventListener('click', (e) => e.stopPropagation());
                
                    modal.addEventListener('click', () => {
                        modal.remove();
                        document.removeEventListener('keydown', escHandler);
                    });
                
                    document.addEventListener('keydown', escHandler);
                
                    modal.appendChild(enlargedImg);
                    document.body.appendChild(modal);
                });
            });
        }).catch((error) => {
            console.error("Error loading images: ", error);
        });
    }

    // Call loadImages to populate the gallery on page load
    loadImages();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const password = prompt("Enter Admin PIN (Hint: Birthday):");
        if (!password || password.trim().toLowerCase() !== '0224') {
            alert("Incorrect PIN. Upload cancelled.");
            return;
        }

        if (imageInput.files.length === 0 || captionInput.value.trim() === '' || titleInput.value.trim() === '') {
            alert('Please provide both an image, a caption, and a title.');
            return;
        }

        const file = imageInput.files[0];
        const caption = captionInput.value.trim();
        const title = titleInput.value.trim();
        const reader = new FileReader();

        reader.onload = function (e) {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            
            const titleElem = document.createElement('h3');
            titleElem.textContent = title;
            titleElem.style.textAlign = 'center';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = caption;
            img.classList.add('gallery-image');
        
            const captionElem = document.createElement('p');
            captionElem.textContent = caption;

            // Add the delete button as usual
            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = '×';
            deleteBtn.classList.add('delete-btn');

            deleteBtn.addEventListener('click', function () {
                const confirmation = prompt("Type the special password to delete this image:");
                if (confirmation && confirmation.toLowerCase().trim() === 'vladimir is the key') {
                    galleryItem.remove();
                } else {
                    alert("Incorrect key. Deletion cancelled.");
                }
            });

            galleryItem.appendChild(deleteBtn);
            galleryItem.appendChild(img);
            galleryItem.appendChild(titleElem);
            galleryItem.appendChild(captionElem);
            imageContainer.appendChild(galleryItem);

            // Store image in Firebase Storage
            const storageRef = storage.ref('images/' + file.name);
            storageRef.put(file).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // After uploading, save the image URL along with the title and caption to Firestore
                    db.collection('gallery').add({
                        title: title,
                        caption: caption,
                        imageURL: downloadURL
                    }).then(() => {
                        console.log("Image successfully uploaded to Firestore!");
                    }).catch((error) => {
                        console.error("Error uploading image to Firestore: ", error);
                    });
                });
            }).catch((error) => {
                console.error("Error uploading image to Firebase Storage: ", error);
            });

            // Reset input fields after upload
            imageInput.value = '';
            captionInput.value = '';
            titleInput.value = '';
        };

        reader.readAsDataURL(file);
    });
});
