### 🛠 HumanEdge Tool

A modern web application built with Next.js for managing HR workflows in a multi-company environment.
This project provides a frontend interface that can be connected to an HR backend (API) to handle employees, companies, roles, and inter-company operations.

⚠️ Note: The current repository is a Next.js scaffold; the backend APIs and business logic for HR and multi-company features should be implemented separately or integrated with a suitable backend service.

### 📌 Table of Contents

About the Project

Tech Stack

Features

Getting Started

Available Scripts

Folder Structure

Environment Variables

Deployment

Contributing

License

### 🧠 About the Project

Multi HR Company Tool is intended to be a web-based platform allowing HR teams to:

Manage employees across multiple companies

View and update employee profiles

Assign roles, departments, and company associations

Utilize features like company selection, dashboard views, and user authentication

The frontend is built using Next.js, offering server-side rendering, routing, and API integration capabilities.

### 🧰 Tech Stack
Component	Technology
Frontend	Next.js (React)
Styling	Tailwind CSS / CSS Modules
Rendering	Server-Side Rendering (SSR) / Static
Deployment	Vercel / Netlify

The application uses standard Next.js conventions (app, pages, or src structure) and development tools like ESLint and Prettier.

### ✨ Features

The features below should be implemented or integrated with backend services as needed.

✔ User Authentication (login/logout)
✔ Dashboard overview
✔ Company selection & multi-company context
✔ Employee listing & profile pages
✔ Role & department management
✔ API integrations for HR data

If this app is intended to integrate with Odoo HR multi-company modules (like hr_employee_multi_company), backend endpoints must expose data accordingly. 
Odoo Community

### 🚀 Getting Started 

Clone the Repository
git clone https://github.com/khanbasiq16/multi_hr_company_tool.git
cd multi_hr_company_tool

Install Dependencies

Using npm:

npm install


Or using yarn:

yarn install

### 🧪 Available Scripts

In the project directory, you can run:

npm run dev

Runs the app in development mode.
Open http://localhost:3000
 to view it in the browser.

npm run build

Builds the application for production.

npm run start

Runs the built production application locally.

npm run lint

Runs ESLint to analyze code quality.

### 📁 Recommended Folder Structure

```text
multi_hr_company_tool/
├── .github/              # GitHub config (CI, Actions etc.)
├── node_modules/         # Installed dependencies
├── public/               # Static assets
│   ├── favicon.ico
│   ├── images/
│   │   └── logo.png
│   └── fonts/
├── src/                  # Source files (main app code)
│   ├── app/              # Next.js App Router routes
│   │   ├── api/          # Backend API routes
│   │   │   ├── auth/     # Auth API (login, logout)
│   │   │   └── employees/# Employee related API
│   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── page.jsx  # Dashboard main page
│   │   │   └── layout.jsx# Dashboard layout
│   │   ├── auth/         # Authentication views
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   └── signup/
│   │   │       └── page.jsx
│   │   ├── companies/    # Company routes
│   │   │   ├── page.jsx  # All companies list
│   │   │   └── [id]/     # Single company dynamic route
│   │   │       └── page.jsx
│   │   ├── employees/    # Employee related pages
│   │   │   ├── page.jsx  # Employee list
│   │   │   └── [id]/     # Single employee profile
│   │   │       └── page.jsx
│   │   ├── settings/     # Settings pages
│   │   │   └── page.jsx
│   │   ├── layout.jsx    # Root layout (header, nav etc.)
│   │   ├── loading.jsx   # Global loading state
│   │   └── not-found.jsx # 404 page
│   ├── components/       # Shared React components
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   ├── EmployeeCard.jsx
│   │   ├── CompanyCard.jsx
│   │   └── UI/           # Small UI parts (buttons, inputs)
│   │       ├── Button.jsx
│   │       └── Input.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/         # API communication logic
│   │   ├── apiClient.js  # Axios or fetch wrapper
│   │   ├── authService.js
│   │   ├── companyService.js
│   │   └── employeeService.js
│   ├── context/          # React Context API providers
│   │   └── AuthContext.js
│   ├── utils/            # Helpers & utilities
│   │   ├── formatDate.js
│   │   └── storage.js
│   ├── styles/           # Tailwind / global CSS
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── config/           # App configuration
│   │   └── routes.js
│   └── types/            # PropTypes or TypeScript types
│       └── index.d.ts
├── .env.local            # Local environment variables
├── .eslintrc.js          # Linting rules
├── .prettierrc           # Prettier config
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS config
└── package.json          # NPM scripts & dependencies

### 🔐 Environment Variables

Create a .env.local file in the project root:

NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_APP_NAME=MultiHRTool


Any additional configuration (like auth keys) should be added here for secure API access.

📦 Deployment

This app can be deployed to platforms like Vercel, Netlify, or AWS Amplify.

Vercel Deployment

Install Vercel CLI:

npm i -g vercel


Deploy:

vercel


Follow the interactive prompts to finish deployment.

🤝 Contributing

Contributions are welcome!

Fork the repository

Create your feature branch (git checkout -b feature/new-feature)

Commit your changes (git commit -m "Add new feature")

Push to the branch (git push origin feature/new-feature)

Open a Pull Request

📜 License

This project is open-source and available under the MIT License — see the LICENSE file for details.

❓About Multi-Company Context

For true multi-company support (backend), consider using frameworks or integrations that support it natively, such as:

Odoo multi-company modules for backend HR data, roles, and company models. 
Odoo Community

Custom REST APIs exposing employee, company, and permission endpoints.