# syntax = docker/dockerfile:1

# Use Ruby 3.3.7 slim image as the base
ARG RUBY_VERSION=3.3.7
FROM ruby:$RUBY_VERSION-slim

# Set the working directory inside the container
WORKDIR /rails

# ======================================================
# Install system packages required for Ruby gems with native extensions
# ======================================================
# build-essential → compilers and build tools needed to compile native extensions
# ca-certificates → ensures HTTPS requests can be made safely
# default-mysql-client & default-libmysqlclient-dev → needed for mysql2 gem
# git → required by some gems or during installation
# libyaml-dev & pkg-config → required by psych gem and other C extensions
# libxml2-dev & libxslt1-dev → required by nokogiri and similar gems
# curl → useful in build scripts
# Cleaning apt cache at the end to reduce image size
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential ca-certificates default-mysql-client default-libmysqlclient-dev git libyaml-dev pkg-config libxml2-dev libxslt1-dev curl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# ======================================================
# Install Ruby gems
# ======================================================

# Copy Gemfile and Gemfile.lock first to leverage Docker cache
COPY Gemfile Gemfile.lock ./

# Install the correct Bundler version (~> 2.6)
# Why: The slim Ruby image comes with Bundler 2.5.22, which may not match Gemfile.lock requirements
RUN gem install bundler -v '~>2.6' --no-document

# Configure Bundler to install gems locally in vendor/bundle
# - deployment 'false': do not enforce deployment mode (useful for dev)
# - path 'vendor/bundle': keeps gems inside container, isolated from system
# Install gems with parallel jobs and retry logic
# Generate binstubs for all gems so executables are available without `bundle exec`
RUN bundle config set --local deployment 'false' && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install --jobs 4 --retry 3 \
    && bundle binstubs --all

# Add gem executables and Rails bin directory to PATH
# This allows running rails, rake, bootsnap, and other gem commands directly
ENV PATH="/rails/bin:/rails/vendor/bundle/ruby/3.3.0/bin:${PATH}"

# Generate binstubs specifically for Rails
# Ensures 'rails' executable is available in PATH
RUN bundle binstubs rails --force

# ======================================================
# Copy the application code
# ======================================================
COPY . .

# Precompile Bootsnap to speed up application boot times
RUN bundle exec bootsnap precompile --gemfile app/ lib/

# ======================================================
# Entrypoint & default command
# ======================================================
# Entrypoint prepares the database before running commands
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expose Rails default port
EXPOSE 3000

# Default command: start Rails server binding to all interfaces
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]

# ======================================================
# EXPLANATION OF KEY FIXES AND PATH CONFIG
# ======================================================

# 1. Bundler version fix (~> 2.6)
# - Ensures that bundle binstubs and other gem commands work correctly
# - Prevents errors caused by Bundler mismatch (image default 2.5.22)

# 2. PATH configuration
# - /rails/bin → contains custom scripts like docker-entrypoint
# - /rails/vendor/bundle/ruby/3.3.0/bin → contains executables of locally installed gems
# - ${PATH} → keeps the original system paths
# The shell searches executables left to right: it will pick Rails and gem commands from our directories first

# 3. Native extension dependencies
# - Gems like psych, nokogiri, mysql2 require compilation against system libraries
# - Missing libraries like libyaml-dev, libxml2-dev, libxslt1-dev cause build errors
# - Slim Ruby images do not include these by default

# Analogy:
# PATH = "/rails/bin" → check here first
#        "/rails/vendor/bundle/ruby/3.3.0/bin" → then check gem executables
#        "${PATH}" → then check system executables like /usr/bin
# This ensures the container uses project-specific versions first and system defaults last