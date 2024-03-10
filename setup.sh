#!/bin/bash
DATABASE_DIR="databases";
PKG_CMD="yarn";
PREVIOUS_CMD="mkdir databases";

if [ ! -d $DATABASE_DIR ]
then
    echo "Creating databases folder";
    mkdir databases;
else
    echo "Database folder exists skipping";
fi

if which $PKG_CMD >/dev/null 2>&1; then
  echo "$PKG_CMD exists. running"
  yarn --version
else
  echo "$PKG_CMD does not exist."
fi

echo "Starting server...";
yarn dev;