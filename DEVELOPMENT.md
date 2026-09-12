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
│   │   └── style.css        # The only stylesheet (tokens, layout, components)
│   ├── fonts/               # Self-hosted IBM Plex Sans (variable) and Plex Mono
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
The single stylesheet, mobile-first, with design tokens at the top (`--orange`,
`--orange-text`, `--ink`, `--hairline`, `--radius`, `--measure`, `--topbar-h`,
avatar sizes, font stacks). Sections in order:
- Fonts and tokens
- Base and `.wrap` container
- Top bar and hero (home) / page head (secondary pages)
- Sections, subheads, year headings
- People: filter strip, grids, avatars
- Media figures
- Collapsibles (`<details data-collapsible>`), research links, plain lists
- Classes, seminar, Student of the Hour, footer
- Easter-egg and confetti animations, reduced-motion overrides

Rules of thumb: one orange (`--orange-text` for text so it passes AA), no box
shadows, one radius, hairlines for separation, Plex Mono only for numbers,
dates and counts.

## JavaScript Functionality

All JavaScript is in `assets/js/main.js`, wrapped in one IIFE:

- **Group filtering**: hides non-matching people and any block left empty
- **Collapsibles**: `<details data-collapsible>` open on desktop, closed on phones
- **PhD randomization**: random ordering of student cards on each load
- **External links**: open in a new tab
- **Friends video**: brief flash each loop; paused under reduced motion
- **Student of the Hour**: seeded hourly pick, compact card, past-24 avatar row
- **Easter eggs**: t (roll), h (rotate), c (reset), i (rain photos)

## Mobile Responsiveness

Mobile-first with two breakpoints:

- **< 640px**: phones (3-up people grid, horizontal filter strip, collapsed
  research/classes/elsewhere, stacked seminar rows, edge-to-edge media)
- **< 900px**: tablets (recordings grid falls to one column)

Check phone layouts at 390px wide; the top bar links must fit without a menu.

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
