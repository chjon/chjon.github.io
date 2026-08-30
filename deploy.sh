#!/bin/sh

yarn run react-router build &&
    mv ./build/client ./build_docs &&
    rm -rf ./build &&
    cp -rt ./build_docs ./assets ./deps/*;

git checkout gh-pages &&
    rm -rf ./docs &&
    mv ./build_docs ./docs;