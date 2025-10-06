# MIT HCI Website

This is the Jekyll-powered website for the Human-Computer Interaction group at MIT CSAIL.

## Development Setup

### Prerequisites

**Important**: This project uses rbenv for Ruby version management to ensure all developers use the same Ruby version and avoid dependency conflicts.

1. **Install rbenv** ([official instructions](https://github.com/rbenv/rbenv))
   ```bash
   # On macOS with Homebrew:
   brew install rbenv ruby-build

   # Add rbenv to your shell profile (.bashrc, .zshrc, etc.)
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
   echo 'eval "$(rbenv init -)"' >> ~/.zshrc

   # Restart your terminal or reload your profile
   source ~/.zshrc
   ```

2. **Install the correct Ruby version**
   ```bash
   # The .ruby-version file specifies Ruby 3.3.6
   rbenv install 3.3.6
   rbenv global 3.3.6  # or just cd into this directory
   ```

3. **Install dependencies**
   ```bash
   bundle install
   ```

### Running the Development Server

```bash
# Serve with live reload (recommended for development)
bundle exec jekyll serve --livereload

# Or serve on all interfaces (useful for testing on other devices)
bundle exec jekyll serve --livereload --host 0.0.0.0
```

The site will be available at `http://localhost:4000` with automatic browser refresh when you make changes.

### Building for Production

```bash
bundle exec jekyll build
```

## Content Management

This website uses Jekyll with data files for easy content management:

### Adding Faculty or PhD Students

Edit the YAML files in `_data/`:
- `_data/faculty.yml` - Faculty and PI information
- `_data/phds.yml` - PhD students and PostDocs
- `_data/groups.yml` - Research group information

### Adding Research Projects

Edit `_data/research.yml` to add new research projects with descriptions and example project links.

### Adding Classes

Edit `_data/classes.yml` to add course information.

### Adding Alumni

Edit `_data/alumni.yml` - organized by graduation year.

## Site Structure

- **Layouts**: `_layouts/` - Page templates
- **Includes**: `_includes/` - Reusable components
- **Data**: `_data/` - All content in YAML format
- **Assets**: `assets/` - Images, CSS, and other static files

## Why rbenv?

Ruby version management is crucial for Jekyll projects because:
- Different Ruby versions can cause gem compatibility issues
- Team members need consistent environments
- Deployment environments should match development
- The `.ruby-version` file ensures everyone uses Ruby 3.3.6

## Troubleshooting

**If you get Ruby version errors:**
1. Check you have rbenv installed: `which rbenv`
2. Check Ruby version: `ruby --version` (should show 3.3.6)
3. Reinstall gems: `bundle install`

**If Jekyll won't start:**
1. Try `bundle update`
2. Make sure you're using `bundle exec jekyll serve`
3. Check for port conflicts (default port 4000)

## Contributing

1. Make sure you're on the `jekyll` branch
2. Follow the rbenv setup above
3. Make your changes
4. Test locally with `bundle exec jekyll serve --livereload`
5. Commit and push your changes
