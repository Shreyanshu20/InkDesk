export const mockProducts = [
  {
    id: 1,
    name: "Premium Leather Journal",
    category: "Journals",
    price: 29.99,
    stock: 45,
    status: "active",
    description: "High-quality leather journal with 240 pages of premium paper.",
    tags: "leather, journal, premium",
    images: [
      "https://images.unsplash.com/photo-1572273869941-44dbbde7a913?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1572429583248-6976fad69051?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 2,
    name: "Fountain Pen Set",
    category: "Pens",
    price: 79.99,
    stock: 12,
    status: "active",
    description: "Elegant fountain pen set with three interchangeable nibs and ink cartridges.",
    tags: "pen, fountain, writing",
    images: [
      "https://images.unsplash.com/photo-1583285132526-9a89e836629b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 3,
    name: "Handcrafted Wax Seal Kit",
    category: "Accessories",
    price: 24.95,
    stock: 8,
    status: "low-stock",
    description: "Complete wax seal kit with wooden handle and three seal designs.",
    tags: "seal, wax, vintage",
    images: [
      "https://images.unsplash.com/photo-1605289355680-75fb41239154?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 4,
    name: "Calligraphy Starter Set",
    category: "Pens",
    price: 45.50,
    stock: 0,
    status: "out-of-stock",
    description: "Complete calligraphy set for beginners with instruction booklet.",
    tags: "calligraphy, beginner, ink",
    images: [
      "https://images.unsplash.com/photo-1569091791842-7cfb64e04797?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 5,
    name: "Vintage Inkwell",
    category: "Accessories",
    price: 37.99,
    stock: 22,
    status: "active",
    description: "Authentic reproduction of a classic glass inkwell with brass fittings.",
    tags: "inkwell, vintage, ink",
    images: [
      "https://images.unsplash.com/photo-1578445970654-75f1f2545adb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ],
  },
];

export const mockCategories = [
  { id: 1, name: "Journals" },
  { id: 2, name: "Pens" },
  { id: 3, name: "Accessories" },
  { id: 4, name: "Paper" },
  { id: 5, name: "Ink" },
];

export const mockOrders = [
  {
    id: 1001,
    customer: {
      id: 1,
      name: "John Smith",
      email: "john@example.com"
    },
    date: "2025-05-15T10:30:00",
    total: 124.95,
    status: "completed",
    items: [
      { id: 1, name: "Premium Leather Journal", price: 49.95, quantity: 2 },
      { id: 2, name: "Fountain Pen Set", price: 25.05, quantity: 1 }
    ]
  },
  {
    id: 1002,
    customer: {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com"
    },
    date: "2025-05-16T14:20:00",
    total: 89.99,
    status: "processing",
    items: [
      { id: 3, name: "Watercolor Notebook", price: 29.99, quantity: 3 }
    ]
  },
  {
    id: 1003,
    customer: {
      id: 3,
      name: "Robert Davis",
      email: "robert@example.com"
    },
    date: "2025-05-17T09:15:00",
    total: 215.90,
    status: "pending",
    items: [
      { id: 4, name: "Calligraphy Starter Kit", price: 79.95, quantity: 1 },
      { id: 5, name: "Artist Sketchbook", price: 45.00, quantity: 3 }
    ]
  },
  {
    id: 1004,
    customer: {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com"
    },
    date: "2025-05-14T16:45:00",
    total: 46.50,
    status: "cancelled",
    items: [
      { id: 6, name: "Mini Notebook Set", price: 15.50, quantity: 3 }
    ]
  },
  {
    id: 1005,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  },
  {
    id: 1006,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  }, {
    id: 1007,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  }, {
    id: 1008,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  }, {
    id: 1009,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  }, {
    id: 1010,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  }, {
    id: 1011,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  }, {
    id: 1012,
    customer: {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com"
    },
    date: "2025-05-18T11:30:00",
    total: 129.95,
    status: "processing",
    items: [
      { id: 7, name: "Luxury Pen Case", price: 59.95, quantity: 1 },
      { id: 8, name: "Premium Ink Set", price: 35.00, quantity: 2 }
    ]
  },
];

// Add this to your mockData.js file after your existing mock data

export const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T08:30:00",
    lastLogin: "2025-05-21T14:35:22",
    address: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA"
    },
    notes: "Main administrator account with full system access.",
    twoFactorEnabled: true,
    sessions: [
      {
        id: "s1",
        device: "MacBook Pro (Chrome)",
        ip: "192.168.1.105",
        location: "San Francisco, CA",
        lastActive: "2025-05-21T14:35:22"
      },
      {
        id: "s2",
        device: "iPhone 14 Pro (Safari)",
        ip: "203.0.113.45",
        location: "San Francisco, CA",
        lastActive: "2025-05-20T09:12:53"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-21T14:35:22",
        message: "Logged in successfully"
      },
      {
        type: "update",
        timestamp: "2025-05-19T11:23:45",
        message: "Updated account security settings"
      },
      {
        type: "login",
        timestamp: "2025-05-18T08:15:30",
        message: "Logged in successfully"
      }
    ],
    orders: [
      {
        id: 1001,
        date: "2025-05-15T10:30:00",
        status: "completed",
        total: 124.95
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "manager",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 987-6543",
    createdAt: "2024-02-28T10:15:00",
    lastLogin: "2025-05-20T16:45:12",
    address: {
      street: "456 Market Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    notes: "Sales manager with client account permissions.",
    twoFactorEnabled: true,
    sessions: [
      {
        id: "s3",
        device: "Dell XPS (Firefox)",
        ip: "198.51.100.42",
        location: "New York, NY",
        lastActive: "2025-05-20T16:45:12"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-20T16:45:12",
        message: "Logged in successfully"
      },
      {
        type: "order",
        timestamp: "2025-05-16T14:20:00",
        message: "Placed order #1002"
      }
    ],
    orders: [
      {
        id: 1002,
        date: "2025-05-16T14:20:00",
        status: "processing",
        total: 89.99
      }
    ]
  },
  {
    id: 3,
    name: "Robert Davis",
    email: "robert@example.com",
    role: "customer",
    status: "active",
    avatar: null,
    phone: "+1 (555) 234-5678",
    createdAt: "2024-03-10T14:45:00",
    lastLogin: "2025-05-17T09:10:33",
    address: {
      street: "789 Oak Avenue",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA"
    },
    notes: "",
    twoFactorEnabled: false,
    sessions: [
      {
        id: "s4",
        device: "Android Galaxy S23 (Chrome)",
        ip: "203.0.113.87",
        location: "Chicago, IL",
        lastActive: "2025-05-17T09:10:33"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-17T09:10:33",
        message: "Logged in successfully"
      },
      {
        type: "order",
        timestamp: "2025-05-17T09:15:00",
        message: "Placed order #1003"
      }
    ],
    orders: [
      {
        id: 1003,
        date: "2025-05-17T09:15:00",
        status: "pending",
        total: 215.90
      }
    ]
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "customer",
    status: "inactive",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 876-5432",
    createdAt: "2024-04-05T11:30:00",
    lastLogin: "2025-04-14T16:40:12",
    address: {
      street: "101 Pine Street",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "USA"
    },
    notes: "Account inactive due to extended period of no activity.",
    twoFactorEnabled: false,
    sessions: [],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-04-14T16:40:12",
        message: "Logged in successfully"
      },
      {
        type: "order",
        timestamp: "2025-05-14T16:45:00",
        message: "Placed order #1004"
      },
      {
        type: "update",
        timestamp: "2025-04-14T16:50:23",
        message: "Updated shipping address"
      }
    ],
    orders: [
      {
        id: 1004,
        date: "2025-05-14T16:45:00",
        status: "cancelled",
        total: 46.50
      }
    ]
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "customer",
    status: "active",
    avatar: null,
    phone: "+1 (555) 345-6789",
    createdAt: "2024-04-22T09:20:00",
    lastLogin: "2025-05-18T11:25:45",
    address: {
      street: "222 Elm Street",
      city: "Austin",
      state: "TX",
      postalCode: "73301",
      country: "USA"
    },
    notes: "Frequent customer, prefers fountain pens and premium notebooks.",
    twoFactorEnabled: false,
    sessions: [
      {
        id: "s5",
        device: "Windows PC (Edge)",
        ip: "198.51.100.173",
        location: "Austin, TX",
        lastActive: "2025-05-18T11:25:45"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-18T11:25:45",
        message: "Logged in successfully"
      },
      {
        type: "order",
        timestamp: "2025-05-18T11:30:00",
        message: "Placed order #1005"
      },
      {
        type: "order",
        timestamp: "2025-05-01T10:15:00",
        message: "Placed order #982"
      }
    ],
    orders: [
      {
        id: 1005,
        date: "2025-05-18T11:30:00",
        status: "processing",
        total: 129.95
      },
      {
        id: 982,
        date: "2025-05-01T10:15:00",
        status: "completed",
        total: 75.50
      }
    ]
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    role: "manager",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-02-18T13:40:00",
    lastLogin: "2025-05-21T10:15:33",
    address: {
      street: "333 Maple Drive",
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "USA"
    },
    notes: "Marketing manager with content publishing permissions.",
    twoFactorEnabled: true,
    sessions: [
      {
        id: "s6",
        device: "MacBook Air (Safari)",
        ip: "203.0.113.22",
        location: "Boston, MA",
        lastActive: "2025-05-21T10:15:33"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-21T10:15:33",
        message: "Logged in successfully"
      },
      {
        type: "update",
        timestamp: "2025-05-20T14:25:12",
        message: "Updated product descriptions"
      }
    ],
    orders: []
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david@example.com",
    role: "customer",
    status: "suspended",
    avatar: null,
    phone: "+1 (555) 567-8901",
    createdAt: "2024-05-02T15:20:00",
    lastLogin: "2025-05-10T09:45:22",
    address: {
      street: "444 Cedar Lane",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "USA"
    },
    notes: "Account suspended due to payment issues.",
    twoFactorEnabled: false,
    sessions: [],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-10T09:45:22",
        message: "Logged in successfully"
      },
      {
        type: "update",
        timestamp: "2025-05-10T09:50:15",
        message: "Failed payment attempt"
      },
      {
        type: "system",
        timestamp: "2025-05-11T00:00:00",
        message: "Account automatically suspended"
      }
    ],
    orders: [
      {
        id: 997,
        date: "2025-05-08T16:30:00",
        status: "payment_failed",
        total: 189.75
      }
    ]
  },
  {
    id: 8,
    name: "Michelle Garcia",
    email: "michelle@example.com",
    role: "customer",
    status: "pending",
    avatar: null,
    phone: "+1 (555) 678-9012",
    createdAt: "2025-05-19T10:00:00",
    lastLogin: null,
    address: {
      street: "555 Birch Street",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      country: "USA"
    },
    notes: "New customer, account verification pending.",
    twoFactorEnabled: false,
    sessions: [],
    activityLog: [
      {
        type: "system",
        timestamp: "2025-05-19T10:00:00",
        message: "Account created"
      },
      {
        type: "system",
        timestamp: "2025-05-19T10:00:05",
        message: "Verification email sent"
      }
    ],
    orders: []
  },
  {
    id: 9,
    name: "Thomas Anderson",
    email: "thomas@example.com",
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 789-0123",
    createdAt: "2024-01-10T09:00:00",
    lastLogin: "2025-05-21T08:45:19",
    address: {
      street: "666 Walnut Avenue",
      city: "Denver",
      state: "CO",
      postalCode: "80201",
      country: "USA"
    },
    notes: "Technical administrator responsible for system maintenance.",
    twoFactorEnabled: true,
    sessions: [
      {
        id: "s7",
        device: "ThinkPad X1 (Chrome)",
        ip: "198.51.100.55",
        location: "Denver, CO",
        lastActive: "2025-05-21T08:45:19"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-21T08:45:19",
        message: "Logged in successfully"
      },
      {
        type: "system",
        timestamp: "2025-05-21T08:50:33",
        message: "System backup initiated"
      },
      {
        type: "system",
        timestamp: "2025-05-21T09:10:45",
        message: "System settings updated"
      }
    ],
    orders: []
  },
  {
    id: 10,
    name: "Jessica Taylor",
    email: "jessica@example.com",
    role: "customer",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 890-1234",
    createdAt: "2024-04-15T14:50:00",
    lastLogin: "2025-05-20T19:30:42",
    address: {
      street: "777 Spruce Road",
      city: "Nashville",
      state: "TN",
      postalCode: "37201",
      country: "USA"
    },
    notes: "",
    twoFactorEnabled: false,
    sessions: [
      {
        id: "s8",
        device: "iPad Pro (Safari)",
        ip: "203.0.113.118",
        location: "Nashville, TN",
        lastActive: "2025-05-20T19:30:42"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-20T19:30:42",
        message: "Logged in successfully"
      },
      {
        type: "update",
        timestamp: "2025-05-20T19:35:17",
        message: "Updated wishlist"
      }
    ],
    orders: [
      {
        id: 976,
        date: "2025-04-25T13:45:00",
        status: "completed",
        total: 87.90
      },
      {
        id: 1012,
        date: "2025-05-20T19:40:00",
        status: "processing",
        total: 129.95
      }
    ]
  },
  {
    id: 11,
    name: "Daniel Kim",
    email: "daniel@example.com",
    role: "customer",
    status: "active",
    avatar: null,
    phone: "+1 (555) 901-2345",
    createdAt: "2024-03-22T12:15:00",
    lastLogin: "2025-05-19T17:20:38",
    address: {
      street: "888 Aspen Court",
      city: "San Diego",
      state: "CA",
      postalCode: "92101",
      country: "USA"
    },
    notes: "Prefers email communication only.",
    twoFactorEnabled: false,
    sessions: [
      {
        id: "s9",
        device: "iPhone 13 (Safari)",
        ip: "198.51.100.88",
        location: "San Diego, CA",
        lastActive: "2025-05-19T17:20:38"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-19T17:20:38",
        message: "Logged in successfully"
      },
      {
        type: "order",
        timestamp: "2025-05-19T17:30:00",
        message: "Placed order #1010"
      }
    ],
    orders: [
      {
        id: 1010,
        date: "2025-05-19T17:30:00",
        status: "processing",
        total: 129.95
      }
    ]
  },
  {
    id: 12,
    name: "Nicole Chen",
    email: "nicole@example.com",
    role: "manager",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    phone: "+1 (555) 012-3456",
    createdAt: "2024-02-05T08:30:00",
    lastLogin: "2025-05-21T11:05:27",
    address: {
      street: "999 Redwood Drive",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "USA"
    },
    notes: "Inventory manager responsible for stock levels.",
    twoFactorEnabled: true,
    sessions: [
      {
        id: "s10",
        device: "Surface Pro (Edge)",
        ip: "203.0.113.201",
        location: "Seattle, WA",
        lastActive: "2025-05-21T11:05:27"
      }
    ],
    activityLog: [
      {
        type: "login",
        timestamp: "2025-05-21T11:05:27",
        message: "Logged in successfully"
      },
      {
        type: "update",
        timestamp: "2025-05-21T11:15:42",
        message: "Updated product inventory"
      }
    ],
    orders: []
  }
];

export const mockBanners = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% off on selected items",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    position: 1,
    location: "homepage",
    startDate: "2025-05-01",
    endDate: "2025-06-30",
    url: "/sale",
    isActive: true,
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Check out our latest products",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    position: 2,
    location: "category",
    startDate: "2025-05-10",
    endDate: "2025-06-15",
    url: "/new-arrivals",
    isActive: true,
  },
  {
    id: 3,
    title: "Exclusive Membership",
    subtitle: "Join now and get 10% off your first purchase",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    position: 3,
    location: "homepage",
    startDate: "2025-04-15",
    endDate: "2025-12-31",
    url: "/membership",
    isActive: true,
  },
  {
    id: 4,
    title: "Free Shipping",
    subtitle: "On all orders over $50",
    image:
      "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    position: 4,
    location: "checkout",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    url: "",
    isActive: true,
  },
  {
    id: 5,
    title: "Coming Soon",
    subtitle: "New product line launching next month",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    position: 5,
    location: "product",
    startDate: "2025-06-15",
    endDate: "2025-06-30",
    url: "/preview",
    isActive: false,
  },
  {
    id: 6,
    title: "Spring Collection",
    subtitle: "Fresh styles for the new season",
    buttonText: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=600&q=80",
    position: 1,
    location: "homepage-carousel",
    startDate: "2025-04-01",
    endDate: "2025-05-31",
    url: "/collections/spring",
    isActive: true,
    textPosition: "left",
  },
];

export const mockReviews = [
  {
    id: 60586,
    product: {
      id: 1,
      name: "Unbranded Fresh Shirt",
      category: "Garden",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
    },
    customer: {
      name: "Irvin Ledner",
      email: "irvin@example.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    rating: 3,
    title: "Good quality but could be better",
    content: "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    date: "2023-03-10T01:41:00",
    status: "approved"
  },
  {
    id: 48211,
    product: {
      id: 2,
      name: "Modern Metal Fish",
      category: "Games",
      image: "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
    },
    customer: {
      name: "Opal Brakus Sr.",
      email: "opal@example.com",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg"
    },
    rating: 5,
    title: "Excellent compression technology",
    content: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    date: "2023-08-06T04:04:00",
    status: "approved"
  },
  {
    id: 40681,
    product: {
      id: 3,
      name: "Sleek Rubber Tuna",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
    },
    customer: {
      name: "Kara Reilly IV",
      email: "kara@example.com",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    rating: 4,
    title: "Very comfortable for long hours",
    content: "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
    date: "2023-04-30T05:06:00",
    status: "approved"
  },
  {
    id: 64606,
    product: {
      id: 4,
      name: "Awesome Bronze Gloves",
      category: "Industrial",
      image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
    },
    customer: {
      name: "Essie Bernier",
      email: "essie@example.com",
      avatar: "https://randomuser.me/api/portraits/women/18.jpg"
    },
    rating: 3,
    title: "Decent quality but sizing runs small",
    content: "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    date: "2023-04-25T07:48:00",
    status: "approved"
  },
  {
    id: 46379,
    product: {
      id: 5,
      name: "Unbranded Frozen Cheese",
      category: "Games",
      image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
    },
    customer: {
      name: "Jamie Pfannerstill",
      email: "jamie@example.com",
      avatar: "https://randomuser.me/api/portraits/men/43.jpg"
    },
    rating: 2,
    title: "Disappointing product quality",
    content: "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
    date: "2022-11-26T08:30:00",
    status: "approved"
  }
];