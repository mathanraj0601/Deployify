#!/bin/bash

export GITHUB_LINK="$GITHUB_LINK"
export FRAMEWORK="$FRAMEWORK"

git clone $GITHUB_LINK /home/app/output
case $FRAMEWORK in
    'ANGULAR')
        exec node angular.js
        ;;
    'REACT')
        exec node react.js 
        ;;
esac

