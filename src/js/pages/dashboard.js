document.addEventListener('DOMContentLoaded', function() {
  
  if (!AuthService.isAuthenticated()) {
    window.location.href = '../pages/login.html';
    return;
  }

  // Get elements
  const avatar = document.getElementById('userAvatar');
  const dropdown = document.getElementById('userDropdown');
  const blogsContainer = document.getElementById('blogsContainer');
  const searchInput = document.querySelector('.search-bar input');
  const searchIcon = document.querySelector('.search-icon');
  
  // Constants
  const BLOGS_PER_PAGE = 9;
  let currentPage = 1;
  let allBlogs = [];
  let filteredBlogs = [];
  
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
  
  // Handle logout
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
  
  //personal Details
  const perosonalDetailBtn = document.getElementById('perosonalDetailBtn');
  if(perosonalDetailBtn){
    perosonalDetailBtn.addEventListener('click', function(e){
      e.preventDefault();
      window.location.href = '../pages/profile.html';
    })
  }

  // Update avatar with current user
  const currentUser = AuthService.getCurrentUser();
  if (currentUser) {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=B38B6D&color=fff`;
    avatar.alt = currentUser.username;
  }

  const writeBtn = document.getElementById('writeBlogBtn');
  if (writeBtn) {
    writeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '../pages/add-blog.html';
    });
  }
  
  // Load all blogs
  loadBlogs();
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    currentPage = 1;
    filterBlogs();
    renderBlogs();
  });
  
  searchIcon.addEventListener('click', function() {
    searchInput.focus();
  });
  
  // Function to load all blogs
  function loadBlogs() {
    BlogService.getAllBlogs()
      .then(blogs => {
        allBlogs = blogs;
        filteredBlogs = [...allBlogs];
        renderBlogs();
      })
      .catch(error => {
        console.error('Error loading blogs:', error);
      });
  }
  
  // Function to filter blogs based on search input
  function filterBlogs() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
      filteredBlogs = [...allBlogs];
    } else {
      filteredBlogs = allBlogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  // Function to render blogs with pagination
  function renderBlogs() {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    const blogsToShow = filteredBlogs.slice(startIndex, endIndex);
    
    // Clear previous content
    blogsContainer.innerHTML = '';
    
    if (blogsToShow.length === 0) {
      blogsContainer.innerHTML = '<p class="no-blogs">No blogs found.</p>';
      return;
    }
    
    // Create blog cards
    blogsToShow.forEach(blog => {
      const blogCard = createBlogCard(blog);
      blogsContainer.appendChild(blogCard);
    });
    
    // Add pagination if needed
    if (filteredBlogs.length > BLOGS_PER_PAGE) {
      createPagination();
    }
  }
  
  // In dashboard.js - Update the createBlogCard function
function createBlogCard(blog) {
  const card = document.createElement('div');
  card.className = 'blog-card';
  
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
  } else if (blog.authorId) {
      // You might want to fetch author name by ID here if needed
      authorName = 'User ' + blog.authorId;
  }
  
  // Get content safely
  const content = typeof blog.content === 'string' ? blog.content : '';
  
  card.innerHTML = `
  <div class="blog-header">
    <h2 class="blog-title">${blog.title || 'Untitled Blog'}</h2>
    <div class="blog-meta">
      <span class="blog-date">${formattedDate}</span>
      <span class="comment-count">💬 ${blog.comments ? blog.comments.length : 0}</span>
    </div>
  </div>
  <div class="blog-author">
    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=B38B6D&color=fff" 
         alt="${authorName}" 
         class="author-avatar">
    <span class="author-name">${authorName}</span>
  </div>
  <div class="blog-content">
    <p>${content.substring(0, 200)}${content.length > 200 ? '...' : ''}</p>
  </div>
  <div class="blog-footer">
    <span class="read-more">Read More →</span>
  </div>
`;
  
  // Add click event to read more
  const readMoreBtn = card.querySelector('.read-more');
  if (readMoreBtn && blog.id) {
      readMoreBtn.addEventListener('click', function() {
          window.location.href = `../pages/blog-detail.html?id=${blog.id}`;
      });
  }
  
  return card;
}
  
  // Function to create pagination controls
  function createPagination() {
    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        renderBlogs();
      }
    });
    
    // Page numbers
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    
    // Show limited page numbers (e.g., 1 2 3 ... 10)
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
      const firstPage = document.createElement('button');
      firstPage.textContent = '1';
      firstPage.addEventListener('click', function() {
        currentPage = 1;
        renderBlogs();
      });
      pageNumbers.appendChild(firstPage);
      
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pageNumbers.appendChild(ellipsis);
      }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.className = 'active';
      }
      pageButton.addEventListener('click', function() {
        currentPage = i;
        renderBlogs();
      });
      pageNumbers.appendChild(pageButton);
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pageNumbers.appendChild(ellipsis);
      }
      
      const lastPage = document.createElement('button');
      lastPage.textContent = totalPages;
      lastPage.addEventListener('click', function() {
        currentPage = totalPages;
        renderBlogs();
      });
      pageNumbers.appendChild(lastPage);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', function() {
      if (currentPage < totalPages) {
        currentPage++;
        renderBlogs();
      }
    });
    
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(nextButton);
    
    blogsContainer.appendChild(paginationContainer);
  }
});