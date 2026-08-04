<div align="center">

# 📊 InsightIQ

### Business Intelligence & Sales Analytics Dashboard

A modern full-stack Business Intelligence dashboard built with **React**, **FastAPI**, **Pandas**, and **SQLite**, providing interactive sales analytics, KPI monitoring, and business insights from retail transaction data.

![Status](https://img.shields.io/badge/Status-Under%20Development-orange)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Python](https://img.shields.io/badge/Python-3.x-3776AB)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8)
![Recharts](https://img.shields.io/badge/Charts-Recharts-FF6384)
![License](https://img.shields.io/badge/License-MIT-green)

---

### 🚧 Project Status

**Actively Under Development**

Dashboard module is completed while Sales, Products, Customers, Insights and Reports modules are currently being implemented.

</div>

---

# 📖 Overview

InsightIQ is a Business Intelligence dashboard that transforms raw retail sales data into meaningful business insights.

Instead of simply displaying tables, the application provides:

- Executive KPI metrics
- Interactive analytical charts
- Paginated sales transactions
- Server-side filtering
- Business performance analysis
- Customer & Product insights
- Report generation

The project demonstrates full-stack software engineering using modern frontend and backend technologies while focusing on scalable architecture and clean code practices.

---

# 📸 Screenshots

## Dashboard Overview

> KPI Dashboard

![Dashboard KPI](screenshots/dashboard.png)

---

> Analytics Dashboard

![Dashboard Charts](screenshots/analytics.png)

---

## Sales Module

> Initial Sales Module

![Sales Empty](screenshots/plain-sales.png)

---

> Paginated Sales Table

![Sales Table](screenshots/paginated-sales.png)

---

# ✨ Features

## 📊 Dashboard

- ✅ Business KPI Cards
- ✅ Total Revenue
- ✅ Total Profit
- ✅ Total Orders
- ✅ Average Order Value
- ✅ Profit Margin
- ✅ Total Customers

---

## 📈 Analytics

- ✅ Monthly Sales & Profit Trend
- ✅ Category-wise Sales Analysis
- ✅ Regional Sales Distribution
- ✅ Interactive Charts
- ✅ Responsive Dashboard

---

## 🛒 Sales Module

- ✅ Paginated Sales Table
- ✅ Backend Pagination
- ✅ Server-side Region Filter
- ✅ Server-side Category Filter

---

## 🚧 Upcoming

- 🔄 Sales Search
- 🔄 Advanced Sorting
- 🔄 Product Analytics
- 🔄 Customer Analytics
- 🔄 Rule-based Business Insights
- 🔄 CSV Report Export
- 🔄 Executive Summary Dashboard

---

# 🏗️ Architecture

```
                React + Vite
                      │
                      ▼
             React Components
                      │
                      ▼
              Native Fetch API
                      │
                      ▼
              FastAPI REST API
                      │
                      ▼
            Analytics Service Layer
                      │
                      ▼
              Dataset Loader
                      │
                      ▼
          Superstore Sales Dataset
```

---

# ⚙️ Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 19 |
| Routing | React Router |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI |
| Language | Python |
| Data Processing | Pandas |
| Database | SQLite |
| API | REST |
| Build Tool | Vite |

---

# 📂 Project Structure

```
InsightIQ
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   │
│   └── package.json
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── data
│   │   ├── services
│   │   ├── models
│   │   ├── schemas
│   │   └── utils
│   │
│   ├── main.py
│   └── requirements.txt
│
├── dataset
│
├── screenshots
│
└── README.md
```

---

# 📊 Dataset

This project uses the **Sample Superstore Sales Dataset**, containing approximately:

- 9,994 Sales Records
- 21 Attributes
- 4 Years of Sales Data

Key fields include:

- Order Date
- Customer Name
- Region
- Category
- Product
- Sales
- Profit
- Quantity
- Discount

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|----------|-----------|----------------|
| GET | `/analytics/kpis` | KPI Summary |
| GET | `/analytics/trends` | Monthly Sales Trend |
| GET | `/analytics/categories` | Category Analysis |
| GET | `/analytics/regions` | Regional Analysis |
| GET | `/sales` | Paginated Sales Records |

---

# 🚀 Running Locally

## Clone

```bash
git clone <repository-url>

cd InsightIQ
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend:

```
http://localhost:8000
```

Swagger:

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 📈 Current Progress

| Module | Status |
|----------|----------|
| Dashboard | ✅ Completed |
| Analytics APIs | ✅ Completed |
| Sales Module | 🚧 In Progress |
| Products Module | ⏳ Planned |
| Customers Module | ⏳ Planned |
| Insights Engine | ⏳ Planned |
| Reports Export | ⏳ Planned |

---

# 🛣️ Roadmap

- [x] Dashboard KPIs
- [x] Analytics Charts
- [x] Sales Pagination
- [x] Backend Filtering
- [ ] Sales Search
- [ ] Sorting
- [ ] Products Dashboard
- [ ] Customers Dashboard
- [ ] Business Insights
- [ ] CSV Export
- [ ] Deployment

---

# 💡 Learning Outcomes

This project demonstrates:

- Full Stack Development
- REST API Design
- Data Visualization
- Business Intelligence Concepts
- Analytics Dashboard Design
- Backend Pagination
- Server-side Filtering
- Data Processing with Pandas
- Responsive UI Development

---

# 🤝 Contributing

Contributions, ideas and suggestions are always welcome.

Feel free to fork the repository and submit pull requests.

---

# 👨‍💻 Author

**Mohit Kumar**

B.Tech Information Technology

Passionate about Full Stack Development, Data Analytics and AI.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

</div>