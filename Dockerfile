# Dockerfile

# Use an official Ruby image as the base
FROM ruby:3.1

# Set a working directory
WORKDIR /usr/src/app

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Copy the Jekyll site files to the container
COPY . .

# Install the dependencies from the Gemfile
RUN bundle install

# Set the preferred API URL as an environment variable - the URL is getting called in the form sending
ENV API_URL=https://rdf-to-csvw.onrender.com/rdftocsvw

# Build the Jekyll site
RUN bundle exec jekyll build

# Expose port 4000 for serving the site
EXPOSE 4000

# for production
# JEKYLL_ENV=production jekyll build --config _config.yml,_config_prod.yml

# Serve the Jekyll site
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
