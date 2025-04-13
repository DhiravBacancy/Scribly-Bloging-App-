// data-dump.js
function initializeData() {
    // Check if data already exists
    if (!localStorage.getItem('users')) {
      const usersData = [
        {
          id: 1,
          username: "John Doe",
          email: "john.doe@bacancy.com",
          password: "John@123",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          id: 2,
          username: "Jane Smith",
          email: "jane.smith@bacancy.com",
          password: "Jane@123",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        }
      ];
      localStorage.setItem('users', JSON.stringify(usersData));
    }
  
    if (!localStorage.getItem('blogs')) {
      const blogsData = [
        // John Doe's blogs (6)
        {
          id: 1,
          title: "Getting Started with Web Development",
          image: "https://images.unsplash.com/photo-1547658719-da2b51169166",
          content: "Web development is an exciting field that combines creativity with technical skills...",
          author: "John Doe",
          authorId: 1,
          createdAt: "2023-06-10T09:15:00Z",
          comments: [
            {
              id: 1,
              userId: 2,
              username: "Jane Smith",
              content: "Great introduction for beginners!",
              timestamp: "2023-06-15T10:30:00Z"
            }
          ]
        },
        {
          id: 2,
          title: "The Power of JavaScript Frameworks",
          image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
          content: "Modern JavaScript frameworks like React, Vue, and Angular have revolutionized...",
          author: "John Doe",
          authorId: 1,
          createdAt: "2023-06-12T14:20:00Z",
          comments: [
            {
              id: 2,
              userId: 2,
              username: "Jane Smith",
              content: "I'm a big fan of Vue.js!",
              timestamp: "2023-06-12T16:45:00Z"
            }
          ]
        },
        {
          id: 3,
          title: "CSS Best Practices for 2023",
          image: "https://images.unsplash.com/photo-1523437113738-bd3cc5fcf483",
          content: "CSS has evolved significantly in recent years. Here are my top 10 best practices...",
          author: "John Doe",
          authorId: 1,
          createdAt: "2023-06-15T11:30:00Z",
          comments: []
        },
        {
          id: 4,
          title: "Mastering Flexbox and Grid",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
          content: "Flexbox and Grid have transformed CSS layouts. Here's how to master them...",
          author: "John Doe",
          authorId: 1,
          createdAt: "2023-06-18T13:45:00Z",
          comments: [
            {
              id: 3,
              userId: 2,
              username: "Jane Smith",
              content: "This saved me so much time!",
              timestamp: "2023-06-19T09:20:00Z"
            }
          ]
        },
        {
          id: 5,
          title: "React Hooks Explained",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
          content: "React Hooks have changed how we write components. Let's break them down...",
          author: "John Doe",
          authorId: 1,
          createdAt: "2023-06-20T16:10:00Z",
          comments: []
        },
        {
          id: 6,
          title: "Building RESTful APIs with Node.js",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
          content: "Learn how to build robust RESTful APIs using Node.js and Express...",
          author: "John Doe",
          authorId: 1,
          createdAt: "2023-06-22T10:05:00Z",
          comments: [
            {
              id: 4,
              userId: 2,
              username: "Jane Smith",
              content: "Very comprehensive guide!",
              timestamp: "2023-06-23T14:30:00Z"
            }
          ]
        },
  
        // Jane Smith's blogs (6)
        {
          id: 7,
          title: "UI/UX Design Principles",
          image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd",
          content: "Good design is more than just aesthetics. Here are the fundamentals...",
          author: "Jane Smith",
          authorId: 2,
          createdAt: "2023-06-11T08:20:00Z",
          comments: [
            {
              id: 5,
              userId: 1,
              username: "John Doe",
              content: "Fantastic overview!",
              timestamp: "2023-06-12T11:15:00Z"
            }
          ]
        },
        {
          id: 8,
          title: "Building Accessible Web Apps",
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
          content: "Accessibility should be a priority, not an afterthought...",
          author: "Jane Smith",
          authorId: 2,
          createdAt: "2023-06-14T15:40:00Z",
          comments: [
            {
              id: 6,
              userId: 1,
              username: "John Doe",
              content: "Great post! Any tool recommendations?",
              timestamp: "2023-06-15T10:45:00Z"
            }
          ]
        },
        {
          id: 9,
          title: "The Future of Responsive Design",
          image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d",
          content: "With new devices emerging, responsive design continues to evolve...",
          author: "Jane Smith",
          authorId: 2,
          createdAt: "2023-06-17T12:30:00Z",
          comments: []
        },
        {
          id: 10,
          title: "CSS Animations Masterclass",
          image: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
          content: "Bring your websites to life with these CSS animation techniques...",
          author: "Jane Smith",
          authorId: 2,
          createdAt: "2023-06-19T09:15:00Z",
          comments: [
            {
              id: 7,
              userId: 1,
              username: "John Doe",
              content: "These examples are amazing!",
              timestamp: "2023-06-20T14:20:00Z"
            }
          ]
        },
        {
          id: 11,
          title: "Vue.js vs React Comparison",
          image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
          content: "A detailed comparison between Vue.js and React for your next project...",
          author: "Jane Smith",
          authorId: 2,
          createdAt: "2023-06-21T16:50:00Z",
          comments: []
        },
        {
          id: 12,
          title: "Web Performance Optimization",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
          content: "Speed matters! Here are proven techniques to optimize your web apps...",
          author: "Jane Smith",
          authorId: 2,
          createdAt: "2023-06-24T11:25:00Z",
          comments: [
            {
              id: 8,
              userId: 1,
              username: "John Doe",
              content: "Implemented these and saw 40% improvement!",
              timestamp: "2023-06-25T09:30:00Z"
            }
          ]
        }
      ];
      localStorage.setItem('blogs', JSON.stringify(blogsData));
    }
  
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(null));
    }
  }
  
  window.initializeData = initializeData;