# Data Cakra Frontend Application

A modern, full-featured content management system built with React, TypeScript, and Vite. This application provides a comprehensive platform for managing articles, categories, comments, and user authentication with a clean, responsive UI.

## 🚀 Features

- **📝 Article Management**: Create, read, update, and delete articles with rich content support
- **🏷️ Category System**: Organize content with hierarchical categories
- **💬 Comment System**: Interactive commenting with user engagement
- **🔐 Authentication**: Secure user authentication with JWT tokens
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🎨 Modern UI**: Beautiful interface using Radix UI components
- **⚡ Fast Performance**: Built with Vite for optimal development experience
- **📊 Data Management**: State management with Zustand
- **🔍 Search & Pagination**: Advanced search capabilities with debounced input
- **🛡️ Type Safety**: Full TypeScript support with strict type checking

## 🛠️ Tech Stack

### Frontend Framework

- **React 19.1.0** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite 6.3.5** - Fast build tool and dev server

### UI & Styling

- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **Shadcn UI** - Headless UI components
- **Lucide React** - Beautiful icons

### State Management & Data

- **Zustand 5.0.5** - Lightweight state management
- **React Hook Form 7.57.0** - Form management
- **Zod 3.25.63** - Schema validation
- **React Cookie** - Cookie management

### Routing & Navigation

- **React Router DOM 7.6.2** - Client-side routing

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - React support for Vite

## 📁 Project Structure

```
src/
├── app/                    # Main application pages
│   ├── index.tsx          # Home/Articles page
│   ├── articles/          # Article-related pages
│   ├── auth/              # Authentication pages
│   ├── category/          # Category management
│   └── not-found/         # 404 page
├── components/
│   ├── container/         # Business logic components
│   │   ├── auth/          # Authentication components
│   │   ├── card-article/  # Article card component
│   │   ├── header/        # Application header
│   │   ├── modal/         # Modal dialogs
│   │   ├── sidebar/       # Navigation sidebar
│   │   └── table/         # Data tables
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── layouts/               # Page layouts
├── lib/
│   ├── constants/         # Application constants
│   ├── middleware/        # Route protection
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript type definitions
│   └── validation/       # Zod schemas
├── style/                # Global styles
└── utils/                # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RayhanAsauqi/tes_fe_data_cakra
   cd tes_fe_data_cakra
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL= <your_api_base_url>
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🔧 Configuration

### API Configuration

The application connects to a backend API. Configure the API URL in your environment variables:

- Environment variable: `VITE_API_URL`

### Authentication

The application uses JWT tokens stored in cookies for authentication. Ensure your backend API supports:

- User registration/login endpoints
- JWT token validation
- Protected routes

## 🎨 UI Components

The application uses a design system built on:

- **Radix UI** for accessible, unstyled components
- **Tailwind CSS** for utility-first styling
- **Custom UI components** in `src/components/ui/`

### Key UI Features

- Responsive navigation with sidebar
- Modal dialogs for CRUD operations
- Data tables with pagination
- Form components with validation
- Toast notifications
- Loading states and skeletons

## 📊 State Management

The application uses **Zustand** for state management with separate stores for:

- **Article Store** (`article-store.ts`) - Article CRUD operations
- **Auth Store** (`auth-store.ts`) - Authentication state
- **Category Store** (`category-store.ts`) - Category management
- **Comment Store** (`comment-store.ts`) - Comment system

## 🛡️ Type Safety

Full TypeScript coverage with:

- Strict type checking enabled
- Custom type definitions in `src/lib/types/`
- Zod schemas for runtime validation
- ESLint with TypeScript rules

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Netlify Deployment

The project includes `netlify.toml` configuration for easy Netlify deployment:

```toml
[build]
  publish = "dist"
  command = "pnpm build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
