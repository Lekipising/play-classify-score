# Welcome to Play & Classify

This a simple and fun app to play with recognizing objects in images.


The application consists of 2 parts:
1. The frontend (this repository)
The frontend is a Next JS app that is deployed to Vercel. Some of the tools used:
- Next JS
- Tailwind CSS
- TypeScript
- Axios (for making API calls)
- React Toastify (for showing notifications)

2. The backend. The backend is a Flask app that endposes a REST endpoint for receiving selected image and giving predictions. The backend is deployed to Render.


## How it works
The user is presented with a number of predefined images where they are supposed to pick the most prominent object in the image. The user can then see how well they did and see the correct answer.

## Purpose
The purpose of this app is to provide an easy way to practice recognizing objects in images. It is intended to be used by people who are learning about image recognition. It is also meant to be used by people who want to have fun with image recognition.

## Video of the app in action
[![Play & Classify](/public/poster.png)](/public/video.webm)

## Visit the app and Play!
[Play & Classify](https://play-classify-score.vercel.app/)