#!/usr/bin/env sh
# package.json "deploy": "yarn build; push-dir --dir=dist --branch=gh-pages --cleanup"

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

# Commit repo
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:BertrandBev/eigen-js.git master:gh-pages

# Nav back
cd -