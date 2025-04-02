FROM ubuntu:24.04

# Install Jekyll dependencies
RUN apt-get update && \
    apt-get install -y ruby-full build-essential zlib1g-dev

# Install Jekyll
ENV GEM_HOME="/home/ubuntu/gems"
ENV PATH="/home/ubuntu/gems/bin:$PATH"
USER ubuntu:ubuntu
RUN gem install jekyll bundler
