# Topic - Fixing the Simple Electron Project

## Problem

When we make the application build using `npm run build`
the executable does not show the HTML. Instead, we get
a blank screen.

## Cause

I had included 'electron-builder' as the build and package
app and it creates archives of electron AND the application
JavaScript & HTML making it hard for main.js to find the
html and get the BrowserWindow class to load it.

## Solution

Use electron-packager instead.
So let's see the problem and then make the solution
and check that the problem is solved.

## Steps

1. npm remove -D electron-builder
2. npm install -D electron-packager
3. Change package.json to use electron-packager

Whoops let me fix that... we need to keep electron-rebuild

OK we are part of the way there. The problem now, I think is the
path to the HTML file. Let's try `npm start`

So there's a 4th step.

4. Edit `index.js` and change the way the applicationHTML file is found.