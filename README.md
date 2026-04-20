# Aamir Fabrics

Welcome to **Aamir Fabrics**, a modern e-commerce web application built to showcase high-quality fabrics, offering a beautiful, responsive, and seamless shopping experience.

## ✨ Features

- **Modern UI/UX**: Built with custom aesthetic guidelines using Tailwind CSS and Framer Motion for smooth animations and transitions.
- **E-Commerce Functionality**: Browse products with an intuitive interface, styled carousels (Swiper), and a fully responsive layout.
- **Authentication**: Secure user authentication implemented seamlessly with NextAuth.js.
- **Database**: Prisma ORM with SQLite handles local development data operations perfectly.
- **Optimized Performance**: Leverages Next.js App Router for server-side rendering and high performance.

## 🛠️ Technologies Used

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Frontend**: React 18, Tailwind CSS, Framer Motion, Swiper
- **Backend & DB**: Prisma ORM, SQLite
- **Security**: NextAuth.js, bcryptjs
- **Language**: TypeScript

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm, yarn, pnpm or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aamir-fabrics
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file to `.env` and fill in the necessary values.
   ```bash
   cp .env.example .env
   ```
   *Make sure `NEXTAUTH_SECRET` is set to a secure string. `DATABASE_URL` is configured to `file:./dev.db` by default.*

4. **Initialize the database:**
   Synchronize Prisma schema with the SQLite database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application locally.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check out the repository and push your improvements.

---
*Developed with Next.js, created by the Faraz Aamir.*
