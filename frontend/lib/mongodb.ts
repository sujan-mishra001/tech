// This file would contain the actual MongoDB Data API integration
// For now, we'll use mock data

// Mock data for content
const mockContent = [
  {
    _id: "1",
    title: "Introduction to Data Science with Python",
    description: "Learn the basics of data science using Python and popular libraries",
    type: "blog",
    tags: ["python", "data-science", "pandas", "numpy"],
    createdAt: "2023-05-15T10:30:00Z",
    featured: true,
  },
  {
    _id: "2",
    title: "Pandas DataFrame Manipulation",
    description: "Common techniques for manipulating DataFrames in pandas",
    type: "snippet",
    tags: ["python", "pandas", "data-manipulation"],
    createdAt: "2023-06-20T14:45:00Z",
    featured: true,
  },
  {
    _id: "3",
    title: "Kaggle Titanic Dataset",
    description: "Famous Titanic dataset for practicing machine learning",
    type: "dataset",
    tags: ["kaggle", "machine-learning", "classification"],
    createdAt: "2023-07-05T09:15:00Z",
    featured: true,
  },
  {
    _id: "4",
    title: "Machine Learning Cheat Sheet",
    description: "Quick reference for common ML algorithms and techniques",
    type: "file",
    tags: ["machine-learning", "reference", "cheat-sheet"],
    createdAt: "2023-08-12T16:20:00Z",
    featured: false,
  },
  {
    _id: "5",
    title: "Hands-On Machine Learning with Scikit-Learn",
    description: "Comprehensive guide to machine learning with scikit-learn",
    type: "book",
    tags: ["machine-learning", "scikit-learn", "python"],
    createdAt: "2023-09-03T11:10:00Z",
    featured: true,
  },
  {
    _id: "6",
    title: "Sentiment Analysis Dashboard",
    description: "Interactive dashboard for analyzing sentiment in text data",
    type: "project",
    tags: ["nlp", "dashboard", "visualization"],
    createdAt: "2023-10-18T13:25:00Z",
    featured: true,
  },
  {
    _id: "7",
    title: "Time Series Forecasting with Prophet",
    description: "Using Facebook Prophet for time series forecasting",
    type: "blog",
    tags: ["time-series", "prophet", "forecasting"],
    createdAt: "2023-11-07T15:40:00Z",
    featured: false,
  },
  {
    _id: "8",
    title: "Neural Network Implementation in PyTorch",
    description: "Building a neural network from scratch with PyTorch",
    type: "snippet",
    tags: ["pytorch", "neural-networks", "deep-learning"],
    createdAt: "2023-12-14T10:05:00Z",
    featured: false,
  },
  {
    _id: "9",
    title: "COVID-19 Global Dataset",
    description: "Comprehensive dataset of COVID-19 cases worldwide",
    type: "dataset",
    tags: ["covid-19", "global-health", "time-series"],
    createdAt: "2024-01-22T09:30:00Z",
    featured: false,
  },
  {
    _id: "10",
    title: "Data Visualization Best Practices",
    description: "Guide to creating effective data visualizations",
    type: "file",
    tags: ["visualization", "best-practices", "matplotlib", "seaborn"],
    createdAt: "2024-02-08T14:15:00Z",
    featured: false,
  },
  {
    _id: "11",
    title: "Deep Learning with Python",
    description: "Comprehensive guide to deep learning with Python",
    type: "book",
    tags: ["deep-learning", "python", "keras", "tensorflow"],
    createdAt: "2024-03-17T11:50:00Z",
    featured: false,
  },
  {
    _id: "12",
    title: "Customer Churn Prediction Model",
    description: "Machine learning model to predict customer churn",
    type: "project",
    tags: ["machine-learning", "classification", "business-analytics"],
    createdAt: "2024-04-25T16:35:00Z",
    featured: false,
  },
]

// Mock data for recent activity
const mockActivity = [
  {
    _id: "1",
    action: "created",
    contentType: "blog",
    contentId: "1",
    contentTitle: "Introduction to Data Science with Python",
    timestamp: "2024-05-20T10:30:00Z",
  },
  {
    _id: "2",
    action: "updated",
    contentType: "snippet",
    contentId: "2",
    contentTitle: "Pandas DataFrame Manipulation",
    timestamp: "2024-05-19T14:45:00Z",
  },
  {
    _id: "3",
    action: "viewed",
    contentType: "dataset",
    contentId: "3",
    contentTitle: "Kaggle Titanic Dataset",
    timestamp: "2024-05-18T09:15:00Z",
  },
  {
    _id: "4",
    action: "created",
    contentType: "file",
    contentId: "4",
    contentTitle: "Machine Learning Cheat Sheet",
    timestamp: "2024-05-17T16:20:00Z",
  },
  {
    _id: "5",
    action: "viewed",
    contentType: "book",
    contentId: "5",
    contentTitle: "Hands-On Machine Learning with Scikit-Learn",
    timestamp: "2024-05-16T11:10:00Z",
  },
]

// Mock data for tags
const mockTags = [
  { _id: "1", name: "python", count: 5 },
  { _id: "2", name: "data-science", count: 3 },
  { _id: "3", name: "machine-learning", count: 4 },
  { _id: "4", name: "pandas", count: 2 },
  { _id: "5", name: "visualization", count: 2 },
  { _id: "6", name: "deep-learning", count: 2 },
  { _id: "7", name: "neural-networks", count: 1 },
  { _id: "8", name: "time-series", count: 2 },
  { _id: "9", name: "classification", count: 2 },
  { _id: "10", name: "nlp", count: 1 },
]

// Mock function to fetch content
export async function fetchContent({
  type,
  featured,
  limit = 10,
}: {
  type?: string
  featured?: boolean
  limit?: number
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredContent = [...mockContent]

  if (type) {
    filteredContent = filteredContent.filter((item) => item.type === type)
  }

  if (featured !== undefined) {
    filteredContent = filteredContent.filter((item) => item.featured === featured)
  }

  return filteredContent.slice(0, limit)
}

// Mock function to fetch content stats
export async function fetchContentStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  const stats = {
    blogs: mockContent.filter((item) => item.type === "blog").length,
    snippets: mockContent.filter((item) => item.type === "snippet").length,
    datasets: mockContent.filter((item) => item.type === "dataset").length,
    files: mockContent.filter((item) => item.type === "file").length,
    books: mockContent.filter((item) => item.type === "book").length,
    projects: mockContent.filter((item) => item.type === "project").length,
    total: mockContent.length,
  }

  return stats
}

// Mock function to fetch recent activity
export async function fetchRecentActivity() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockActivity
}

// Mock function to fetch tags
export async function fetchTags(contentType?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (contentType) {
    // In a real app, we would filter tags by content type
    return mockTags.slice(0, 6)
  }

  return mockTags
}

// Mock function to upload content
export async function uploadContent({
  type,
  title,
  description,
  content,
  file,
  url,
  tags,
}: {
  type: string
  title: string
  description: string
  content?: string
  file?: File | null
  url?: string
  tags: string[]
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would upload to MongoDB Data API
  console.log("Uploading content:", {
    type,
    title,
    description,
    content: content ? `${content.substring(0, 50)}...` : undefined,
    file: file ? file.name : undefined,
    url,
    tags,
  })

  // Return a mock response
  return {
    success: true,
    _id: Math.random().toString(36).substring(2, 15),
  }
}
