document.addEventListener('DOMContentLoaded', function() {
    // Authentication check
    if (!AuthService.isAuthenticated()) {
        window.location.href = '../pages/login.html';
        return;
    }

    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }

    // Set user avatar
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=B38B6D&color=fff`;
        avatar.alt = currentUser.username;
    }

    // DOM Elements
    const uploadInput = document.getElementById('blogImageUpload');
    const uploadLabel = document.querySelector('.upload-label');
    const uploadBox = document.querySelector('.image-upload-box');
    const previewContainer = document.querySelector('.preview-container');
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImage');
    const blogImageInput = document.getElementById('blogImage');
    const newBlogForm = document.getElementById('newBlogForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (!uploadInput || !newBlogForm) return;

    // Drag and drop functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        uploadBox.classList.add('highlight');
    }

    function unhighlight() {
        uploadBox.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) {
            handleFileSelect(file);
        }
    }

    // Add drag and drop event listeners
    if (uploadBox) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, unhighlight, false);
        });

        uploadBox.addEventListener('drop', handleDrop, false);
    }

    // Handle file selection
    function handleFileSelect(file) {
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                if (imagePreview) imagePreview.src = event.target.result;
                if (blogImageInput) blogImageInput.value = event.target.result;
                if (uploadLabel) uploadLabel.classList.add('hidden');
                if (previewContainer) previewContainer.classList.remove('hidden');
            };
            
            reader.onerror = function() {
                alert('Error reading the image file.');
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (JPEG, PNG, etc.)');
        }
    }

    // Event Listeners
    uploadInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    });

    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (uploadInput) uploadInput.value = '';
            if (imagePreview) imagePreview.src = '';
            if (blogImageInput) blogImageInput.value = '';
            if (previewContainer) previewContainer.classList.add('hidden');
            if (uploadLabel) uploadLabel.classList.remove('hidden');
        });
    }

    // Form Submission - Updated to match BlogService
    newBlogForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('blogTitle')?.value.trim();
        const content = document.getElementById('blogContent')?.value.trim();
        const image = blogImageInput?.value || '';
        
        // Validation
        if (!title || !content) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Create blog object (simplified structure)
            const blogData = {
                title,
                content,
                image
            };

            // Add blog using BlogService
            const addedBlog = BlogService.addBlog(blogData);
            
            if (addedBlog) {
                // Optional: Show success message
                alert('Blog created successfully!');
                window.location.href = '../pages/dashboard.html';
            } else {
                throw new Error('Failed to add blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            alert('Error creating blog. Please try again.');
        }
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Your unsaved changes will be lost.')) {
                window.location.href = '../pages/dashboard.html';
            }
        });
    }
});