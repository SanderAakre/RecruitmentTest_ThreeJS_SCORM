# Vehicle Part Viewer - Three.js SCORM Project

This project is a 3D viewer built with Three.js, designed to show info on parts of a model in an interactive environment. Each part of the model has clickable icons that display additional information fetched from a WordPress page. The SCORM-compliant module tracks user progress and completion, making it compatible with LMS systems like Cornerstone.

The airplane model was created by me in Blender, and textured using Substance Painter. The HDR environment was captured from a personal Unreal Engine 5 project.

## Features

- **3D Model Interaction**: Rotate and zoom to explore the model from various angles. Only the airplane model is included in this repository, but additional models can be added.
- **Part Information Icons**: Clickable icons appear when a part faces the camera, allowing users to view detailed information.
- **WordPress Integration**: Information on each part is dynamically fetched from WordPress pages. Other sites can also be used; the URL for each part can be set in the JSON file for the model.
- **SCORM Compliance**: Tracks progress for each part, saving completion status once all parts have been viewed.
- **Landing Gear Animation**: Extend and retract the landing gear with a clickable button.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npx vite` to start the development server.

## Building and Exporting as SCORM

To create a SCORM-compatible zip package:

1. Build the project to generate the production-ready files: `npx vite build`.
2. Copy the following files to a zip folder:

- Content of the `dist` folder (from `vite build`).
- `imsmanifest.xml` (required by SCORM).
- `src/SCORM_API_wrapper.js` (SCORM API wrapper).

3. Upload the zip file as a SCORM package to your LMS.

## Controls

- **Orbit Camera**: Left-click and drag.
- **Rotate Model**: Right-click and drag, or hold `Shift` or `Ctrl` while left-clicking and dragging.
- **Zoom**: Scroll mouse wheel.
- **View Part Information**: Click icons that appear when a part is facing the camera.
- **Toggle Landing Gear**: Click the "Toggle Landing Gear" button to extend/retract the landing gear.

## Known Issues and bugs

- **Icon freeze bug**: Icons may freeze in place if the model is rotated for a while. Rotating the camera fixes this.
- **Material looks washed out**: The model's textures were created for Unreal Engine, and have not been optimized for Three.js.
- **WordPress banner**: The information popup has a banner from WordPress because I didn't want to subscribe to a paid plan to remove it.
