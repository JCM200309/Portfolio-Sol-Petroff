## Design System: Femora

### Pattern
- **Name:** Storytelling-Driven
- **CTA Placement:** Above fold
- **Sections:** Hero > Features > CTA

### Style
- **Name:** Brutalism
- **Keywords:** Raw, unpolished, stark, high contrast, plain text, default fonts, visible borders, asymmetric, anti-design
- **Best For:** Design portfolios, artistic projects, counter-culture brands, editorial/media sites, tech blogs
- **Performance:** ÔÜí Excellent | **Accessibility:** Ô£ô WCAG AAA

### Colors
| Role | Hex |
|------|-----|
| Primary | #3B82F6 |
| Secondary | #60A5FA |
| CTA | #F97316 |
| Background | #F8FAFC |
| Text | #1E293B |

*Notes: Black + White + Minimal accent*

### Typography
- **Heading:** Archivo
- **Body:** Space Grotesk
- **Mood:** minimal, portfolio, designer, creative, clean, artistic
- **Best For:** Design portfolios, creative professionals, minimalist brands
- **Google Fonts:** https://fonts.google.com/share?selection.family=Archivo:wght@300;400;500;600;700|Space+Grotesk:wght@300;400;500;600;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Key Effects
No smooth transitions (instant), sharp corners (0px), bold typography (700+), visible grid, large blocks

### Avoid (Anti-patterns)
- Corporate minimalism
- Hidden portfolio

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

