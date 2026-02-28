# Full Stack Developer Portfolio

A breathtaking single-page portfolio website built with React, TypeScript, and Tailwind CSS featuring a stunning black and red color scheme with smooth scrolling navigation.

## Features

- 🎨 Stunning dark theme with black (#0a0a0a) and red (#dc2626) accents
- 🎭 Smooth animations with Motion (Framer Motion)
- 📱 Fully responsive design across all devices
- 🧭 Single-page design with smooth scroll navigation
- 📊 Comprehensive sections:
  - **Home** - Hero section with Spline 3D integration area
  - **About** - Personal info, education, and certifications
  - **Skills** - Technical skills with proficiency levels
  - **Experience** - Professional timeline with achievements
  - **Projects** - Portfolio showcase with filtering
  - **Blog** - Featured and recent articles
  - **Contact** - Working contact form with social links
- 🎯 Fixed navigation bar with active section indicators
- ⬆️ Back to top button
- 🎨 Custom red-themed scrollbar

## Navigation

The portfolio uses smooth scrolling navigation:
- Click any nav link to smoothly scroll to that section
- Navigation automatically highlights the current section
- Mobile-responsive hamburger menu
- Back to top button in footer

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- Lucide React Icons
- Vite

## Structure

```
/src
  /app
    /components
      - Navigation.tsx (Fixed navbar)
      - Home.tsx (Hero + Spline 3D area)
      - About.tsx (Bio + Education)
      - Skills.tsx (Technical skills)
      - Experience.tsx (Work timeline)
      - Projects.tsx (Portfolio showcase)
      - Blog.tsx (Articles)
      - Contact.tsx (Contact form)
      - Footer.tsx (Footer + back to top)
    - App.tsx (Main component)
  /styles
    - index.css (Custom styles + scrollbar)
    - theme.css (Color variables)
```

## Features Details

### Smooth Scrolling
All navigation automatically scrolls smoothly with proper offset for the fixed navbar.

### Animations
- Fade in/up animations on scroll using `whileInView`
- Smooth transitions between nav items
- Hover effects on cards and buttons
- Scale animations on interactive elements

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Responsive grids that adapt to screen size
- Touch-friendly buttons and links

### Performance
- Optimized images using ImageWithFallback component
- Efficient animations with Motion
- Lazy loading for images
- Minimal dependencies

## Customization Tips

1. **Replace placeholder images** with your actual project screenshots
2. **Update all text content** to reflect your experience and skills
3. **Change skill levels** to match your expertise
4. **Add your actual project links** (GitHub and live URLs)
5. **Update social media links** with your profiles
6. **Customize colors** in theme.css if desired

## Notes

- All external links (GitHub, social media) are currently set to `preventDefault()` - remove this when adding real links
- The contact form is frontend-only - connect it to your backend or email service
- Blog posts are static - integrate with a CMS if you want dynamic content
- Spline 3D placeholder should be replaced with your actual 3D scene

## Deployment

This is a standard Vite React app and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build command: `npm run build`
