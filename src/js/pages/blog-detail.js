document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!AuthService.isAuthenticated()) {
      window.location.href = '../pages/login.html';
      return;
    }
  
    // Set user avatar
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      const avatar = document.getElementById('userAvatar');
      if (avatar) {
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=B38B6D&color=fff`;
        avatar.alt = currentUser.username;
      }
    }

     // Dropdown functionality
  const avatar = document.getElementById('userAvatar');
  const dropdown = document.getElementById('userDropdown');
  
  if (avatar && dropdown) {
    // Toggle dropdown when avatar is clicked
    avatar.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking anywhere else
    document.addEventListener('click', function() {
      dropdown.classList.remove('show');
    });
    
    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
    // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = parseInt(urlParams.get('id'));
  
    if (!blogId) {
      window.location.href = '../pages/dashboard.html';
      return;
    }
  
    // Load blog data
    loadBlogDetail(blogId);
  
    // Set up event listeners
    const writeBtn = document.getElementById('writeBlogBtn');
    if (writeBtn) {
      writeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../pages/add-blog.html';
      });
    }
  
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        AuthService.logout();
        window.location.href = '../pages/login.html';
      });
    }

    
  // Handle user-blogs
  const yourBlogBtn = document.getElementById('yourBlogBtn');
  if (yourBlogBtn) {
    yourBlogBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '../pages/user-blogs.html';
    });
  }
  
    // Comment submission handler
    const submitCommentBtn = document.getElementById('submit-comment');
    if (submitCommentBtn) {
      submitCommentBtn.addEventListener('click', addNewComment);
    }
  
    // Handle Enter key in comment textarea
    const commentTextarea = document.getElementById('new-comment');
    if (commentTextarea) {
      commentTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          addNewComment();
        }
      });
    }

    // Navigation handlers
    document.querySelector('.back-button').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../pages/dashboard.html';
    });

    // Comment submission handler
    document.getElementById('submit-comment').addEventListener('click', function() {
        // ... existing code ...
    });

    // Delete comment handler
    function handleDeleteComment(commentId) {
        // ... existing code ...
    }
  });
  
  function loadBlogDetail(blogId) {
    const blog = BlogService.getBlogById(blogId);
    
    if (!blog) {
      window.location.href = '../pages/dashboard.html';
      return;
    }
  
    // Format date
    const date = new Date(blog.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    // Get author name safely
    let authorName = 'Anonymous';
    if (blog.author) {
      if (typeof blog.author === 'string') {
        authorName = blog.author;
      } else if (blog.author.username) {
        authorName = blog.author.username;
      }
    }
  
    // Update DOM elements
    document.getElementById('detail-title').textContent = blog.title || 'Untitled Blog';
    document.getElementById('detail-date').textContent = formattedDate;
    
    const authorAvatar = document.getElementById('detail-avatar');
    authorAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=B38B6D&color=fff`;
    authorAvatar.alt = authorName;
    
    document.getElementById('detail-author-name').textContent = authorName;
    
    const image = document.getElementById('detail-image');
    if (blog.image && blog.image !== 'default.jpg') {
      image.src = blog.image;
    } else {
      image.style.display = 'none';
    }
    
    document.getElementById('detail-content').textContent = blog.content || '';
  
    // Update comment count
    updateCommentCount(blog.comments);
  
    // Load comments
    if (blog.comments && blog.comments.length > 0) {
      renderComments(blog.comments);
    } else {
      const commentsList = document.getElementById('comments-list');
      if (commentsList) {
        commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      }
    }
  }
  
  function updateCommentCount(comments) {
    const countElement = document.getElementById('comment-count');
    if (!countElement) return;
    
    const count = comments ? comments.length : 0;
    countElement.textContent = `${count} ${count === 1 ? 'comment' : 'comments'}`;
  }
  
  function renderComments(comments) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    if (!comments || comments.length === 0) {
      commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }
    
    // Sort comments by date (newest first)
    const sortedComments = [...comments].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    sortedComments.forEach(comment => {
      const commentElement = createCommentElement(comment);
      commentsList.appendChild(commentElement);
    });
  }
  
  function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.dataset.commentId = comment.id;
    
    // Format date
    const date = new Date(comment.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    commentDiv.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=B38B6D&color=fff" 
               class="comment-avatar" 
               alt="${comment.username}">
          <span class="comment-name">${comment.username}</span>
        </div>
        <span class="comment-date">${formattedDate}</span>
      </div>
      <div class="comment-content">${comment.content}</div>
      <div class="comment-actions">
        <button class="comment-button edit">Edit</button>
        <button class="comment-button delete">Delete</button>
      </div>
      <div class="comment-edit-form" style="display: none;">
        <textarea>${comment.content}</textarea>
        <div class="comment-edit-buttons">
          <button class="comment-button cancel-edit">Cancel</button>
          <button class="comment-button save-edit">Save</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    setupCommentEventListeners(commentDiv);
    
    return commentDiv;
  }
  
  function setupCommentEventListeners(commentDiv) {
    const editButton = commentDiv.querySelector('.comment-button.edit');
    const deleteButton = commentDiv.querySelector('.comment-button.delete');
    const editForm = commentDiv.querySelector('.comment-edit-form');
    const cancelButton = commentDiv.querySelector('.cancel-edit');
    const saveButton = commentDiv.querySelector('.save-edit');
    const commentContent = commentDiv.querySelector('.comment-content');
    const editTextarea = editForm.querySelector('textarea');
    
    // Edit button click handler
    editButton.addEventListener('click', function() {
        commentContent.style.display = 'none';
        editForm.style.display = 'block';
        editTextarea.focus();
    });
    
    // Cancel button click handler
    cancelButton.addEventListener('click', function() {
        editForm.style.display = 'none';
        commentContent.style.display = 'block';
        editTextarea.value = commentContent.textContent;
    });
    
    // Save button click handler
    saveButton.addEventListener('click', function() {
        const newContent = editTextarea.value.trim();
        if (newContent) {
            const commentId = commentDiv.dataset.commentId;
            updateComment(commentId, newContent);
            commentContent.textContent = newContent;
            editForm.style.display = 'none';
            commentContent.style.display = 'block';
        }
    });
    
    // Delete button click handler
    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this comment?')) {
            const commentId = commentDiv.dataset.commentId;
            deleteComment(commentId);
            commentDiv.remove();
        }
    });
  }
  
  function addNewComment() {
    const commentInput = document.getElementById('new-comment');
    const content = commentInput.value.trim();
    
    if (!content) {
      commentInput.focus();
      return;
    }
    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '../pages/login.html';
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = parseInt(urlParams.get('id'));
    
    // Create new comment
    const newComment = {
      id: Date.now(), // Simple ID generation
      userId: currentUser.id,
      username: currentUser.username,
      content: content,
      timestamp: new Date().toISOString()
    };
    
    // Add comment to blog
    const blog = BlogService.getBlogById(blogId);
    if (!blog.comments) {
      blog.comments = [];
    }
    blog.comments.push(newComment);
    BlogService.saveBlog(blog);
    
    // Refresh comments and count
    renderComments(blog.comments);
    updateCommentCount(blog.comments);
    commentInput.value = '';
    commentInput.focus();
  }
  
  function updateComment(commentId, newContent) {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = parseInt(urlParams.get('id'));
    
    const blog = BlogService.getBlogById(blogId);
    const comment = blog.comments.find(c => c.id === parseInt(commentId));
    
    if (comment) {
      comment.content = newContent;
      comment.timestamp = new Date().toISOString(); // Update timestamp
      BlogService.saveBlog(blog);
      renderComments(blog.comments);
      updateCommentCount(blog.comments);
    }
  }
  
  function deleteComment(commentId) {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = parseInt(urlParams.get('id'));
    
    const blog = BlogService.getBlogById(blogId);
    blog.comments = blog.comments.filter(c => c.id !== parseInt(commentId));
    BlogService.saveBlog(blog);
    
    // Refresh comments and count
    renderComments(blog.comments);
    updateCommentCount(blog.comments);
  }