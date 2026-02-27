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

## Spline 3D Integration

The portfolio is designed to be adaptable for your Spline 3D scene. To integrate your Spline 3D:

### Option 1: Using Spline Viewer (Recommended)

1. Install the Spline package:
```bash
npm install @splinetool/react-spline
```

2. Open `/src/app/components/Home.tsx`

3. Import Spline at the top:
```tsx
import Spline from '@splinetool/react-spline';
```

4. Find the `#spline-container` div (around line 29) and replace it with:
```tsx
<div className="absolute inset-0 z-0" id="spline-container">
  <Spline scene="https://prod.spline.design/your-scene-url" />
</div>
```

### Option 2: Using Spline iframe

1. Open `/src/app/components/Home.tsx`
2. Find the `#spline-container` div
3. Replace its content with:
```tsx
<div className="absolute inset-0 z-0" id="spline-container">
  <iframe 
    src="https://my.spline.design/your-scene-url" 
    frameBorder="0" 
    width="100%" 
    height="100%"
    style={{ border: 'none' }}
  />
</div>
```

## Customization

### Personal Information

Update your personal details in these files:

1. **Contact Information** - `/src/app/components/Contact.tsx`
   - Email, phone, location
   - Social media links

2. **About Section** - `/src/app/components/About.tsx`
   - Personal bio
   - Education history
   - Certifications

3. **Skills** - `/src/app/components/Skills.tsx`
   - Technical skills and proficiency levels
   - Soft skills

4. **Experience** - `/src/app/components/Experience.tsx`
   - Work history
   - Achievements
   - Technologies used

5. **Projects** - `/src/app/components/Projects.tsx`
   - Project showcase with images
   - GitHub and live links

6. **Blog** - `/src/app/components/Blog.tsx`
   - Blog post articles
   - Featured posts

### Colors

The color scheme is defined in `/src/styles/theme.css`:
- Primary red: `#dc2626`
- Background: `#0a0a0a` (deep black)
- Card background: `#111111`
- Secondary: `#1a1a1a`

To change colors, update the CSS variables in the `:root` section.

### Branding

Update the logo/initial in:
- `/src/app/components/Navigation.tsx` (line 55)
- `/src/app/components/Footer.tsx` (line 39)

Change the "D" to your initial and update the brand name.

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

---

Made with ❤️ and lots of coffee
