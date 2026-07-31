# Business Insights Dashboard

## Project Goal

Build a modern, responsive Business Insights Dashboard that analyzes retail sales data and presents meaningful business insights through interactive dashboards, charts, tables, and reports.

This project is intended as a portfolio project for the Google Data Analytics Apprenticeship and should demonstrate practical data analysis skills rather than advanced machine learning.

---

# Target Users

- Business Managers
- Sales Managers
- Data Analysts
- Recruiters reviewing technical portfolios

---

# Dataset

Dataset:
Sample Superstore Dataset (CSV)

The dataset will be stored locally and loaded by the backend.

No live database imports.

---

# Tech Stack

Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Recharts

Backend
- FastAPI
- Pandas
- SQLite

Deployment
Frontend → Vercel

Backend → Render

Development Environment
Localhost only during development.

---

# Functional Requirements

The application shall provide:

## Dashboard

Display key business KPIs

- Total Revenue
- Total Profit
- Total Orders
- Average Order Value
- Total Customers

Display visual analytics

- Monthly Sales Trend
- Monthly Profit Trend
- Sales by Category
- Sales by Region

---

## Sales Module

Display transaction records.

Support

- Search
- Sorting
- Pagination

Filters

- Category
- Region
- Year

---

## Products Module

Display

- Top Selling Products
- Least Selling Products
- Most Profitable Products
- Least Profitable Products

---

## Customers Module

Display

- Top Customers
- Highest Revenue Customers
- Most Frequent Customers

---

## Analytics Module

Generate business insights such as

- Best performing category
- Worst performing category
- Highest revenue month
- Lowest revenue month
- Highest profit region
- Lowest profit region
- Top 10 customers contribution
- Revenue by segment

Insights should be calculated from data.

No AI-generated insights.

---

## Reports

Allow users to export

- CSV summary

PDF export may be added later.

---

# Non Functional Requirements

Responsive design

Desktop

Tablet

Mobile

Fast loading

Clean UI

Simple navigation

Reusable components

Readable code

---

# Data Flow

CSV

↓

SQLite

↓

Pandas Analysis

↓

FastAPI REST API

↓

React Dashboard

---

# Out of Scope

Authentication

User accounts

Role management

Payments

Machine Learning

LLMs

Real-time streaming

External APIs

---

# Success Criteria

The application should allow a recruiter to understand business performance within a few minutes by exploring dashboards, charts, filters, and analytical insights.

The codebase should be modular, maintainable, and production-ready.