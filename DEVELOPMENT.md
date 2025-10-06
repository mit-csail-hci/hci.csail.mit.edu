# MIT HCI Group Website - Development Documentation

This is the website for the Human-Computer Interaction group at MIT CSAIL.

## Technology Stack

- **Jekyll**: Static site generator
- **Liquid**: Templating language
- **YAML**: Data storage format
- **CSS**: Styling (modular architecture)
- **JavaScript**: Interactive features

## Project Structure

```
hci.csail.mit.edu/
├── _config.yml              # Jekyll configuration
├── _data/                   # YAML data files
│   ├── faculty.yml          # Faculty members
│   ├── phds.yml             # PhD students and postdocs
│   ├── groups.yml           # Research groups
│   ├── classes.yml          # Course information
│   ├── research.yml         # Research projects
│   ├── seminar.yml          # Seminar schedule
│   └── alumni.yml           # Alumni information
├── _includes/               # Reusable components
│   └── header.html          # Site header
├── _layouts/                # Page templates
│   └── default.html         # Main layout
├── assets/
│   ├── css/
│   │   ├── style.css        # Main styles
│   │   └── interactive.css  # Interactive components
│   ├── js/
│   │   └── main.js          # JavaScript functionality
│   └── images/              # Images and logos
├── index.html               # Homepage
└── *.html                   # Additional pages
```

## Adding Content

### Adding a New Faculty Member

Edit `_data/faculty.yml`:

```yaml
- name: Professor Name
  url: https://example.com
  image: professor-name.jpg
  group_id: group_identifier
```

Place profile picture in `assets/images/profile-pictures/faculty/`

### Adding a New PhD Student

Edit `_data/phds.yml`:

```yaml
- name: Student Name
  url: https://example.com
  image: student-name.jpg
  group_id: group_identifier
  academic_level: phd  # or postdoc, ugrad
```

Place profile picture in `assets/images/profile-pictures/students/`

### Adding a Research Group

Edit `_data/groups.yml`:

```yaml
group_identifier:
  name: Full Group Name
  url: https://group-website.com
  short_name: Short Name
```

### Adding a Class

Edit `_data/classes.yml`:

```yaml
- name: Course Number
  full_name: Full Course Name
  description: Course description
  semester: Fall 2024
  url: https://course-website.com
```

### Adding a Research Project

Edit `_data/research.yml`:

```yaml
- title: Project Title
  authors: Author names
  venue: Conference/Journal name
  url: https://project-page.com
  group_id: group_identifier
```

## CSS Architecture

The stylesheets are organized for maintainability:

### `style.css`
Main stylesheet with clearly commented sections:
- Base styles (typography, colors, layout)
- Header/banner
- People section (faculty, PhD students)
- Research section
- Classes section
- Seminar section
- Alumni section
- Footer
- Responsive breakpoints

### `interactive.css`
Dynamic and interactive components:
- Group filtering UI
- Filtering states and animations
- Research project cards
- Easter egg animations
- Hint popups

## JavaScript Functionality

All JavaScript is in `assets/js/main.js` with clear function documentation:

- **Scroll effects**: Header overlay on scroll
- **Section anchors**: Automatic anchor link generation
- **PhD randomization**: Random ordering of PhD student profiles
- **External links**: Auto-open in new tabs
- **Group filtering**: Filter PhD students by research group
- **Easter eggs**: Fun keyboard interactions (t, h, c keys)

## Mobile Responsiveness

The site uses a mobile-first approach with breakpoints at:

- **768px**: Tablet/small desktop
- **600px**: Mobile devices
- **400px**: Small mobile devices

Key mobile optimizations:
- Full-height banner on mobile
- Horizontal faculty layout (compact)
- Vertical PhD student layout (larger pictures)
- Hidden group filters (show all students)
- Touch-friendly buttons (44px minimum)

## Profile Pictures

Profile pictures should:
- Be square (1:1 aspect ratio recommended)
- Use consistent file formats (.jpg or .png)
- Be reasonably sized (200-500KB)
- Have descriptive filenames (lowercase-with-dashes.jpg)

The CSS automatically enforces circular display with proper cropping.

## Local Development

1. Install Jekyll:
   ```bash
   gem install jekyll bundler
   bundle install
   ```

2. Run local server:
   ```bash
   bundle exec jekyll serve
   ```

3. View at `http://localhost:4000`

## Deployment

The site is deployed via GitHub Pages. Simply push to the main branch:

```bash
git add .
git commit -m "Update content"
git push origin main
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Accessibility

- Semantic HTML structure
- Alt text for all images
- Keyboard navigation support
- Sufficient color contrast
- Responsive text sizing

## Easter Eggs

Hidden keyboard shortcuts for fun:
- Press `t`: Roll all profile pictures
- Press `h`: Randomly rotate pictures
- Press `c`: Reset all effects

## Maintenance Tasks

### Regular Updates
- Update seminar schedule
- Add new research publications
- Update alumni list
- Refresh course information

### Image Optimization
Profile pictures are automatically sized by CSS, but pre-optimizing images helps with load times.

### Performance
- Minimize CSS/JS where possible
- Optimize images
- Leverage browser caching
- Use CDN for fonts

## Contact

For website issues or questions:
- Andre Ye (andreye@mit.edu)
- Carmel Schare (schare@mit.edu)

Previous webmasters: Josh Pollock, Faraz Faruqi

## License

Website template is MIT licensed. Original template by [Lea Verou](https://github.com/LeaVerou/).
