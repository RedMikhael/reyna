document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');
    const imageContainer = document.getElementById('imageContainer');
    const titleInput = document.getElementById('titleInput');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const password = prompt("Enter Admin PIN (Hint: Birthday):");
        if (!password || password.trim().toLowerCase() !== '0224') {
            alert("Incorrect PIN. Upload cancelled.");
            return;
        }

        if (imageInput.files.length === 0 || captionInput.value.trim() === ''||
        titleInput.value.trim() === '') {
            alert('Please provide both an image and a caption.');
            return;
        }
        

        const file = imageInput.files[0];
        const caption = captionInput.value.trim();
        const reader = new FileReader();

        reader.onload = function (e) {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            
            const titleElem = document.createElement('h3');
            titleElem.textContent = titleInput.value.trim();
            titleElem.style.textAlign = 'center';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = caption;
            img.classList.add('gallery-image');
        
            const captionElem = document.createElement('p');
            captionElem.textContent = caption;
        
            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = '×';
            deleteBtn.classList.add('delete-btn');

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
            
            
            document.addEventListener('DOMContentLoaded', function () {
                const form = document.getElementById('uploadForm');
                const imageInput = document.getElementById('imageInput');
                const captionInput = document.getElementById('captionInput');
                const imageContainer = document.getElementById('imageContainer');
            
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
            
                    if (imageInput.files.length === 0 || captionInput.value.trim() === '') {
                        alert('Please provide both an image and a caption.');
                        return;
                    }
            
                    const file = imageInput.files[0];
                    const caption = captionInput.value.trim();
                    const reader = new FileReader();
            
                    reader.onload = function (e) {
                        const galleryItem = document.createElement('div');
                        galleryItem.classList.add('gallery-item');
                    
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = caption;
                        img.classList.add('gallery-image');
                    
                        const captionElem = document.createElement('p');
                        captionElem.textContent = caption;
                    
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
                        const imageContainer = document.getElementById('imageContainer');
                        //imageContainer.insertBefore(galleryItem, imageContainer.firstChild);
                        imageContainer.appendChild(galleryItem);
                        
                    
                        imageInput.value = '';
                        captionInput.value = '';
                        titleInput.value = '';
                    };
                    reader.readAsDataURL(file);
                });
            });
            
            deleteBtn.addEventListener('click', function () {
                // Create overlay
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = 0;
                overlay.style.left = 0;
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                overlay.style.zIndex = 9999;
            
                // Create password prompt box
                const promptBox = document.createElement('div');
                promptBox.style.background = '#fff';
                promptBox.style.padding = '20px';
                promptBox.style.borderRadius = '8px';
                promptBox.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                promptBox.style.textAlign = 'center';
            
                const promptText = document.createElement('p');
                promptText.textContent = 'Enter the special password to delete this image:';
                promptText.style.marginBottom = '10px';
            
                const passwordInput = document.createElement('input');
                passwordInput.type = 'password';
                passwordInput.placeholder = 'Password';
                passwordInput.style.padding = '8px';
                passwordInput.style.width = '96%';
                passwordInput.style.marginBottom = '10px';
                passwordInput.style.borderRadius = '4px';
                passwordInput.style.border = '1px solid #ccc';
            
                const confirmButton = document.createElement('button');
                confirmButton.textContent = 'Confirm';
                confirmButton.style.padding = '8px 12px';
                confirmButton.style.border = 'none';
                confirmButton.style.background = '#35424a';
                confirmButton.style.color = '#fff';
                confirmButton.style.borderRadius = '4px';
                confirmButton.style.cursor = 'pointer';
            
                confirmButton.onclick = function () {
                    const value = passwordInput.value.trim().toLowerCase();
                    if (value === 'vladimir is the key') {
                        galleryItem.remove();
                        document.body.removeChild(overlay);
                    } else {
                        alert('Incorrect key. Deletion cancelled.');
                        document.body.removeChild(overlay);
                    }
                };
            
                promptBox.appendChild(promptText);
                promptBox.appendChild(passwordInput);
                promptBox.appendChild(confirmButton);
                overlay.appendChild(promptBox);
                document.body.appendChild(overlay);
            });
            
        
            galleryItem.appendChild(deleteBtn);
            galleryItem.appendChild(img);
            galleryItem.appendChild(titleElem); 
            galleryItem.appendChild(captionElem);
            gallery.appendChild(galleryItem);
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.insertBefore(galleryItem, imageContainer.firstChild);
            
        
            imageInput.value = '';
            captionInput.value = '';
            titleInput.value = '';
        };
        reader.readAsDataURL(file);
    });
});


