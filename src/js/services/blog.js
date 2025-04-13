class BlogService {
    static getBlogs() {
      return JSON.parse(localStorage.getItem('blogs')) || [];
    }
  
    static saveBlogs(blogs) {
      localStorage.setItem('blogs', JSON.stringify(blogs));
    }
  
    static addBlog(blog) {
      const blogs = this.getBlogs();
      const currentUser = AuthService.getCurrentUser();
      const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
      
      const newBlog = { 
        ...blog,
        id: newId,
        createdAt: new Date().toISOString(),
        author: currentUser?.username || 'Anonymous',
        authorId: currentUser?.id || null
      };
      
      blogs.push(newBlog);
      this.saveBlogs(blogs);
      return newBlog;
    }
  
    static getAllBlogs() {
      return new Promise((resolve) => {
        const blogs = this.getBlogs();
        // Sort by date (newest first) and ensure each blog has author info
        const processedBlogs = blogs.map(blog => ({
          ...blog,
          author: blog.author || 'Anonymous' // Ensure author always has a value
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        resolve(processedBlogs);
      });
    }
  
    static getBlogById(id) {
      const blogs = this.getBlogs();
      const blog = blogs.find(blog => blog.id === id);
      
      // Ensure author information exists
      if (blog) {
        return {
          ...blog,
          author: blog.author || 'Anonymous'
        };
      }
      return null;
    }
  
    static deleteBlog(id) {
      const blogs = this.getBlogs().filter(blog => blog.id !== id);
      this.saveBlogs(blogs);
    }
  
    // Get blogs by a specific author
    static getBlogsByAuthor(authorId) {
      const blogs = this.getBlogs();
      return blogs.filter(blog => blog.authorId === authorId);
    }
  
    // Update blog (including author verification)
    static updateBlog(id, updatedData) {
      const blogs = this.getBlogs();
      const index = blogs.findIndex(blog => blog.id === id);
      
      if (index !== -1) {
        // Preserve original author information
        updatedData.author = blogs[index].author;
        updatedData.authorId = blogs[index].authorId;
        
        blogs[index] = { 
          ...blogs[index],
          ...updatedData,
          updatedAt: new Date().toISOString() 
        };
        
        this.saveBlogs(blogs);
        return blogs[index];
      }
      return null;
    }

     // Add this method to update existing blogs
     static saveBlog(updatedBlog) {
        const blogs = this.getBlogs();
        const index = blogs.findIndex(blog => blog.id === updatedBlog.id);
        if (index !== -1) {
          blogs[index] = updatedBlog;
          this.saveBlogs(blogs);
          return true;
        }
        return false;
      }
    
      // Additional useful methods
      static deleteBlog(id) {
        const blogs = this.getBlogs().filter(blog => blog.id !== id);
        this.saveBlogs(blogs);
      }
    
  }