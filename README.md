# 🚀 Research & Innovation Center (RIC-SAU)

A modern, high-performance research & innovation website built with **Next.js 13**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **GSAP**. Features a comprehensive admin dashboard, news management, events system, and research project showcase.

**Live Demo:** [https://ric-sau.kallanroy.xyz](https://ric-sau.kallanroy.xyz)

---

## ✨ Features

### Core Features
- 📰 **News & Press Releases** - Archive with single article pages and dynamic routing
- 📅 **Events Management** - Grid view and detailed event pages with slug-based routing
- 🏆 **Achievements & Partnerships** - Showcase of accomplishments and collaborations
- 🔬 **Research Projects** - Detailed project pages with filtering and categorization
- 👥 **Team Directory** - Team member profiles with specializations
- 📚 **Publications & Labs** - Research publications and laboratory information
- 🎛️ **Advanced Admin Dashboard** - Comprehensive content management system with:
  - 📸 Image upload system (file upload or URL)
  - ✍️ Rich text editor with Markdown support
  - 🎨 Logo & branding management
  - 🔗 Social media integration
  - 11 content management tabs
- 🎬 **Video Integration** - YouTube video modal with `react-player`
- ⚡ **Smooth Animations** - Framer Motion + GSAP for engaging user experience
- 🧭 **Responsive Navigation** - Mobile-friendly navbar with login/logout state

### Performance Optimizations
- 🖼️ **Image Optimization** - Next.js Image component with AVIF/WebP support
- ⚡ **Code Splitting** - Dynamic imports for below-the-fold components
- 🚀 **Lazy Loading** - GSAP and heavy libraries loaded asynchronously
- 📦 **Bundle Optimization** - Webpack code splitting and vendor chunking
- 🔗 **Link Prefetching** - Automatic prefetching for faster navigation
- 💾 **API Caching** - ISR with 60-second revalidation and CDN caching
- 🎨 **CSS Optimization** - Tailwind JIT mode and optimized builds
- 📱 **Resource Hints** - Preconnect and DNS-prefetch for external resources

---

## 🧰 Tech Stack

### Core
- **Next.js 13.5.1** (App Router)
- **React 18.2.0** + **TypeScript 5.2.2**
- **Tailwind CSS 3.3.3** (JIT mode)

### UI & Animation
- **Framer Motion 12.23.12** - Smooth animations
- **GSAP 3.13.0** - Advanced scroll animations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **shadcn/ui** - Component library

### Forms & Validation
- **React Hook Form 7.53.0**
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Form validation

### Additional Libraries
- **react-player** - Video playback
- **recharts** - Data visualization
- **date-fns** - Date manipulation
- **react-intersection-observer** - Scroll-based animations

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/kallanchandraroy/ric-sau.git
cd ric-sau

# 2. Install dependencies
npm install
# or
yarn install
# or
pnpm install

# 3. Create environment file (optional)
cp .env.example .env.local

# 4. Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🏗️ Project Structure

```
ric-sau/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   ├── content/       # Content management API
│   │   ├── upload/        # Image upload API
│   │   └── settings/      # Site settings API
│   ├── contact/           # Contact page
│   ├── dashboard/         # Admin dashboard
│   ├── events/            # Events pages
│   ├── news/              # News pages
│   ├── research/          # Research pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── sections/          # Page sections
│   └── ui/                # UI components (shadcn/ui)
│       ├── image-upload.tsx    # Image upload component
│       └── rich-text-editor.tsx # Rich text editor
├── lib/                   # Utility functions
├── public/                 # Static assets
│   └── uploads/           # Uploaded images directory
├── hooks/                  # Custom React hooks
├── ADMIN_GUIDE.md         # Complete admin dashboard guide
├── next.config.js          # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Base URL (optional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Token (for dashboard access)
# Set in localStorage: adminToken = "loggedIn"
```

---

## 🚀 Performance Features

### Image Optimization
- Automatic WebP/AVIF conversion
- Responsive image sizing
- Lazy loading with priority hints
- Remote image pattern configuration

### Code Splitting
- Dynamic imports for heavy components
- Vendor chunk separation
- Route-based code splitting
- Optimized package imports

### Caching Strategy
- API route caching (60s revalidation)
- CDN cache headers
- Static page generation
- Image cache TTL optimization

### Build Optimizations
- SWC minification
- Console removal in production
- CSS optimization
- Deterministic module IDs

---

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero, features, stats, and news
- `/about` - About RIC-SAU
- `/research` - Research overview
- `/research/projects` - Research projects listing
- `/research/publications` - Publications archive
- `/research/labs` - Laboratory information
- `/news` - News listing
- `/news/[slug]` - Individual news article
- `/events` - Events listing
- `/events/[slug]` - Individual event page
- `/team` - Team members
- `/contact` - Contact information
- `/innovators` - Innovators showcase
- `/rl-committee` - Research & Learning Committee
- `/resources` - Resources page

### Admin Pages
- `/login` - Admin login (static token: "loggedIn")
- `/dashboard` - Admin dashboard with CRUD operations

---

## 🔐 Admin Access

To access the admin dashboard:

1. Navigate to `/login`
2. Enter the following credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You will be automatically redirected to `/dashboard` upon successful login

### 🎛️ Advanced Dashboard Features

The admin dashboard now includes **comprehensive content management** with the following capabilities:

#### Content Management (11 Tabs)
- **Overview** - Stats and quick insights
- **Home** - Hero section with background image upload and video integration
- **About** - Mission, vision, with rich text editor and image upload
- **Projects** - Research projects with image uploads
- **News** - Articles with rich text editor and featured images
- **Events** - Event management with banner uploads
- **Team** - Team profiles with photo uploads
- **Innovators** - Innovator profiles with photo uploads
- **RL-Committee** - Committee member profiles with photo uploads
- **Contact** - Contact information management
- **Settings** - Site-wide settings (logo, favicon, social media, branding)

#### ✨ Advanced Features
- 📸 **Image Upload System** - Upload files directly (max 5MB) or use URLs
  - Supported formats: JPEG, PNG, GIF, WebP
  - Automatic file storage in `/public/uploads/`
  - Image preview and validation
- ✍️ **Rich Text Editor** - Markdown-based editor with:
  - Formatting toolbar (Bold, Italic, Headings, Lists, Links)
  - Live preview tab
  - Used for About page and News articles
- 🎨 **Logo & Branding Management** - Upload site logo and favicon
- 🔗 **Social Media Integration** - Configure social media links
- 🌐 **Site Settings** - General information, SEO, theme configuration

#### API Endpoints
- `/api/content` - Content CRUD operations (GET, POST, PUT, DELETE)
- `/api/upload` - Image file uploads with validation
- `/api/settings` - Site settings management

📖 **[View Complete Admin Guide](ADMIN_GUIDE.md)** for detailed instructions on using all dashboard features.

**Note:** In production, implement proper authentication with secure password hashing, JWT tokens, and database integration.

---

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update `app/globals.css` for global styles
- Component styles use Tailwind utility classes

### Content
- Edit mock data in `app/api/content/route.ts`
- Replace with your database/API in production
- Update static content in respective page files

---

## 📊 Build Output

```bash
npm run build
```

**Expected Output:**
- ✅ All pages generated successfully
- ✅ Static pages optimized
- ✅ Bundle size: ~286-291 KB (First Load JS)
- ✅ Code splitting: Vendors chunk separated
- ✅ 21 pages generated

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is private and proprietary.

---

## 👥 Contact

**Research & Innovation Center (RIC-SAU)**
- 📍 4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh
- 📞 +880244814019
- 📧 info.sauric@gmail.com

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/) and [GSAP](https://greensock.com/gsap/)

---

**Made with ❤️ for Research & Innovation**
