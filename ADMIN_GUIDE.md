# 🎛️ Advanced Admin Dashboard - Complete Guide

## 📋 Overview

The RIC-SAU Admin Dashboard is a comprehensive content management system that allows you to manage all aspects of your website including content, images, settings, and branding.

---

## 🔐 Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

**Access URL:** [http://localhost:3000/login](http://localhost:3000/login)

---

## 🎯 Dashboard Features

### 1. Overview Tab
- Quick statistics for all content types
- Recent activity feed
- Content summary cards

### 2. Home Page Management
- **Hero Section:**
  - Title, Subtitle, Description
  - Background Image Upload
  - Video URL (YouTube integration)
- Image upload support for hero backgrounds

### 3. About Page Management
- Mission Statement
- Vision Statement
- Description (with Rich Text Editor)
- Established Year
- About Page Image Upload
- Markdown formatting support

### 4. Research Projects
- **Add/Edit/Delete Projects**
- Fields:
  - Project Title
  - Description
  - Category (AI, Agriculture, etc.)
  - Project Status
  - Project Lead Name
  - Start Date
  - Budget (৳)
  - **Project Image Upload**
- Visual project cards with thumbnails

### 5. News & Articles
- **Full Article Management**
- Fields:
  - Article Title
  - Excerpt (Summary)
  - **Full Content (Rich Text Editor with Markdown)**
  - Category
  - Read Time
  - **Featured Image Upload**
- Preview functionality
- Markdown support: **bold**, *italic*, headings, lists, links

### 6. Events Management
- **Upcoming & Past Events**
- Fields:
  - Event Title
  - Description
  - Date & Time
  - Location
  - Category (Conference, Summit, Workshop)
  - **Event Banner Upload**
- Auto-generates URL slugs

### 7. Team Members
- **Team Directory Management**
- Fields:
  - Full Name
  - Position/Role
  - Department
  - Email Contact
  - Professional Bio
  - **Profile Photo Upload**
- Visual team cards with photos

### 8. Innovators
- **Innovator Profiles**
- Fields:
  - Name
  - Title
  - Bio
  - Specialization
  - Achievements (comma-separated)
  - **Profile Photo Upload**

### 9. RL Committee
- **Research & Learning Committee**
- Fields:
  - Member Name
  - Role/Position
  - Department
  - Email
  - Bio
  - **Profile Photo Upload**

### 10. Contact Information
- Office Address
- Phone Number
- Email Address
- Office Hours
- Easy update interface

### 11. Site Settings ⚙️
- **General Information:**
  - Site Name
  - Tagline
  - Site Description
  - Footer Text

- **Logo & Branding:**
  - **Site Logo Upload** (Header logo)
  - **Favicon Upload** (Browser icon)
  - Logo preview

- **Social Media Links:**
  - Facebook
  - Twitter
  - LinkedIn
  - YouTube
  - Instagram

---

## 📸 Image Upload Features

### How to Upload Images

1. **File Upload Method:**
   - Click "Choose File" button
   - Select image from your computer
   - Automatic upload and preview
   - Supported formats: JPEG, PNG, GIF, WebP
   - Max size: 5MB

2. **URL Method:**
   - Click "Use URL Instead"
   - Paste external image URL
   - Instant preview

### Image Storage
- Uploaded images are stored in `/public/uploads/`
- Automatic filename generation with timestamps
- Direct CDN-friendly paths

### Image Validation
- ✅ Format validation (JPEG, PNG, GIF, WebP)
- ✅ Size validation (Max 5MB)
- ✅ Automatic preview
- ✅ Easy removal option

---

## ✍️ Rich Text Editor

### Markdown Formatting
The rich text editor supports:
- **Bold Text:** `**bold**`
- *Italic Text:* `*italic*`
- # Headings: `# H1`, `## H2`, `### H3`
- Lists: `- item`
- > Blockquotes: `> quote`
- [Links](url): `[text](url)`

### Editor Features
- **Toolbar:** Quick formatting buttons
- **Preview Tab:** Live preview of formatted content
- **Split View:** Editor and preview side-by-side
- **Syntax Highlighting:** Markdown syntax support

---

## 🎨 Content Management Best Practices

### Images
1. **Optimal Sizes:**
   - Logo: 200x60px (PNG with transparency)
   - Favicon: 32x32px or 64x64px
   - Hero Images: 1920x1080px
   - News/Events: 800x600px
   - Profile Photos: 400x400px

2. **Format Recommendations:**
   - Logos: PNG (transparent background)
   - Photos: JPEG or WebP
   - Icons: PNG or SVG

### Content Writing
1. **News Articles:**
   - Use compelling headlines
   - Write concise excerpts (2-3 sentences)
   - Include relevant categories
   - Add high-quality images

2. **Project Descriptions:**
   - Clear, concise descriptions
   - Highlight key objectives
   - Mention team leads and departments
   - Update status regularly

3. **Team Profiles:**
   - Professional photos
   - Concise bios (2-3 sentences)
   - Include credentials and expertise
   - Valid contact information

---

## 🔄 Workflow

### Adding New Content
1. Navigate to the appropriate tab
2. Click "Add [Content Type]"
3. Fill in all required fields
4. Upload images (or use URLs)
5. Preview (if available)
6. Click "Add" or "Save"
7. Verify content appears in the list

### Editing Content
1. Find the content item
2. Click "Edit" button
3. Modify fields as needed
4. Upload new images if needed
5. Click "Update" or "Save"

### Deleting Content
1. Find the content item
2. Click "Delete" (trash icon)
3. Confirm deletion
4. Item is removed immediately

---

## 🚀 API Endpoints

### Content API (`/api/content`)
- **GET:** Fetch content by type
  - Query params: `type` (home, about, projects, news, events, team, innovators, rlCommittee, contact)
- **POST:** Create new content
- **PUT:** Update existing content
- **DELETE:** Remove content

### Upload API (`/api/upload`)
- **POST:** Upload image files
  - Accepts FormData with 'file' field
  - Returns URL path
  - Max size: 5MB
  - Formats: JPEG, PNG, GIF, WebP

### Settings API (`/api/settings`)
- **GET:** Fetch site settings
  - Query params: `section` (general, seo, social, theme, features)
- **POST:** Update settings
  - Body: `{ section, data }`

---

## 🛡️ Security Best Practices

### For Production Deployment:

1. **Authentication:**
   - Implement JWT tokens
   - Use bcrypt for password hashing
   - Add rate limiting
   - Implement CSRF protection

2. **File Uploads:**
   - Add virus scanning
   - Implement file type verification
   - Use cloud storage (AWS S3, Cloudinary)
   - Add image optimization pipeline

3. **Database:**
   - Replace mockData with real database (PostgreSQL, MongoDB)
   - Implement proper data validation
   - Add backup mechanisms
   - Use environment variables for sensitive data

4. **Access Control:**
   - Implement role-based permissions
   - Add audit logging
   - Session management
   - IP whitelisting for admin panel

---

## 📦 Future Enhancements

### Planned Features:
- [ ] Bulk image upload
- [ ] Image gallery manager
- [ ] Analytics dashboard
- [ ] SEO meta tags per page
- [ ] Email notifications
- [ ] Export/Import functionality
- [ ] Version control for content
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced search and filters

---

## 🐛 Troubleshooting

### Image Upload Issues
1. Check file size (must be < 5MB)
2. Verify file format (JPEG, PNG, GIF, WebP only)
3. Ensure `/public/uploads/` directory exists
4. Check write permissions

### Login Issues
1. Clear localStorage: `localStorage.clear()`
2. Use correct credentials (admin/admin123)
3. Check browser console for errors
4. Try different browser

### Content Not Saving
1. Check browser console for errors
2. Verify all required fields are filled
3. Check network tab for API responses
4. Refresh the page and try again

---

## 📞 Support

For issues or questions:
- Email: info.sauric@gmail.com
- Phone: +880244814019

---

**Last Updated:** March 2026
