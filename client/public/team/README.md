# Team Member Images

This folder contains images for team members displayed on the About page.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 300x300 pixels or larger (will be resized to 128x128)
- **Aspect Ratio**: Square (1:1) preferred
- **File Size**: Keep under 1MB for optimal loading
- **Naming**: Use lowercase with hyphens (e.g., `john-doe.jpg`)

## Current Team Members

- `sarah.jpg` - Sarah Johnson (Lead AI Engineer / Software Engineer at Tech Corp)
- `michael.jpg` - Michael Chen (Product Manager / Marketing Manager at Digital Solutions)  
- `emily.jpg` - Emily Rodriguez (UX Designer / UX Designer at Creative Studio)

## Usage

These images are used in two places:
1. **Team Section** (About page) - Shows team member profiles with roles and bios
2. **Testimonials Section** (Home page) - Shows the same people as satisfied users with different roles/companies

## Adding New Team Members

1. Add the image file to this folder
2. Update the team data in `src/data/teamData.js`
3. Make sure the image path matches the filename

## Image Optimization Tips

- Use tools like TinyPNG or ImageOptim to compress images
- Consider using WebP format for better compression
- Ensure good lighting and professional appearance
- Crop to focus on the face for better results

## Fallback Images

If an image fails to load, the system will automatically use a fallback image from Unsplash. You can customize fallback images in the team data file. 