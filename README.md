# 📊 BI Platform - Business Intelligence & Data Visualization

A powerful, modern web-based Business Intelligence platform for data analysis and visualization. Built with Next.js, React, and Chart.js.

![BI Platform](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

###  Data Management
- **CSV Upload** - Drag & drop or click to upload datasets
- **Instant Parsing** - Real-time data processing and validation
- **Large File Support** - Handle datasets with thousands of rows
- **Data Preview** - Interactive table view with pagination

### 🔍 Data Analysis
- **Statistical Insights** - Mean, median, mode, std deviation, variance
- **Missing Value Detection** - Identify and handle null values
- **Outlier Detection** - Z-score based outlier identification
- **Data Type Recognition** - Automatic numeric column detection

### 🧹 Data Transformation
- **Column Selection** - Choose specific columns for analysis
- **Missing Value Handling**
  - Drop rows with missing values
  - Fill with mean
  - Fill with median
- **GroupBy Aggregation**
  - Sum
  - Mean (Average)
  - Count
  - Minimum
  - Maximum
- **Normalization** - Scale data to 0-1 range
- **Outlier Removal** - Z-score method (3σ threshold)

### 📈 Visualization
- **Auto-Generated Charts** - Instant visualizations for your data
- **Custom Chart Builder** - Create your own charts
- **Multiple Chart Types**
  - Line charts (trends over time)
  - Bar charts (comparisons)
  - Scatter plots (correlations)
  - Pie charts (distributions)
- **Multi-Series Support** - Compare multiple columns
- **Interactive Charts** - Hover for detailed values

###  User Interface
- **Modern Dark Theme** - Cyberpunk-inspired design
- **Office-Style Ribbon** - Intuitive navigation
- **Responsive Layout** - Works on desktop and tablet
- **Real-Time Updates** - Instant feedback on actions
- **Status Bar** - Always know your data stats

##  Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:starlord78275/bi-platform.git

# Navigate to project directory
cd bi-platform

# Install dependencies
npm install

# Run development server
npm run dev
