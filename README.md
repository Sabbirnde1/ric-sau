# 🚀 Research & Innovation Center (RIC-SAU)

A modern, high-performance research and innovation website built with **Next.js 13**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **GSAP**. It features a comprehensive admin dashboard, news management, an events system, and a research project showcase.

**Database:** Powered by **Neon PostgreSQL** (serverless, auto-scaling)  
**🌐 Live Demo:** [https://ric-sau-five.vercel.app](https://ric-sau-five.vercel.app) (Deployed on Vercel)

---

## ✨ Features

### Core Features
- 📰 **News & Press Releases** - Archive with single article pages and dynamic routing
- 📅 **Events Management** - Grid view and detailed event pages with slug-based routing
- 🏆 **Achievements & Partnerships** - Showcase of accomplishments and collaborations
- 🔬 **Research Projects** - Detailed project pages with filtering and categorization
- 👥 **Team Directory** - Team member profiles with specializations
- 📚 **Publications & Labs** - Research publications and laboratory information
- 🎛️ **Advanced Admin Dashboard** - Comprehensive content management system covering 11 tabs, featuring image uploads, a Markdown rich-text editor, and branding settings.
- 🎬 **Video Integration** - YouTube video modal with `react-player`
- ⚡ **Smooth Animations** - Framer Motion + GSAP for an engaging user experience
- 🧭 **Responsive Navigation** - Mobile-friendly navbar with secure routing

### Performance Optimizations
- 🖼️ **Image Optimization** - Next.js Image component with AVIF/WebP support
- ⚡ **Code Splitting & Lazy Loading** - Dynamic imports for heavy components and GSAP animations
- 💾 **API Caching** - ISR with 60-second revalidation and CDN caching
- 🎨 **CSS Optimization** - Tailwind JIT mode and optimized builds

---

## 🧰 Tech Stack

### Core
- **Next.js** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS**

### UI & Animation
- **Framer Motion** & **GSAP** - Smooth, advanced scroll animations
- **Radix UI** & **shadcn/ui** - Accessible component primitives
- **Lucide React** - Icon library

### Forms & Database
- **React Hook Form** + **Zod** - Schema validation
- **Prisma ORM** - Type-safe database queries
- **Neon PostgreSQL** - Serverless database

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- A free Neon PostgreSQL database ([neon.tech](https://neon.tech))

### 1. Clone the repository
```bash
git clone https://github.com/Sabbirnde1/ric-sau.git
cd ric-sau
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template file to create your local environment configuration:
```bash
cp .env.local.template .env.local
```
Edit `.env.local` and add your Neon connection string (`DATABASE_URL`).

### 4. Setup the Database
```bash
npm run db:push      # Create database tables
npm run db:seed      # Populate with initial data
```

### 5. Start Development Server
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio (visual database editor)
```

---

## 🔐 Admin Dashboard Access

The application features a fully-functional admin dashboard.

1. Navigate to `/login`
2. Enter the default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You will be redirected to `/dashboard`

*Note: For production, ensure you implement proper authentication with secure password hashing, JWT tokens, and database integration.*

---

## 🚢 Deployment

This project is fully optimized for **Vercel** serverless deployment.

**Quick Deploy to Vercel:**
1. Push your code to GitHub.
2. Connect the repository to Vercel.
3. Add your environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`) in the Vercel dashboard.
4. Vercel will automatically build and deploy your application.

*(You can also use `npx vercel --prod` via the Vercel CLI to deploy directly from your terminal).*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👥 Contact

**Research & Innovation Center (RIC-SAU)**
- 📍 4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh
- 📞 +880244814019
- 📧 info.sauric@gmail.com

---

**Made with ❤️ for Research & Innovation**
