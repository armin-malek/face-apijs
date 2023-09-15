// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
// import "@tensorflow/tfjs-node";
require("@tensorflow/tfjs-node");

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
// import * as canvas from "canvas";
const canvas = require("canvas");

// import * as faceapi from "face-api.js";
// import { faceDetectionNet, faceDetectionOptions } from "./comons.js";
// import fs from "fs";
const faceapi = require("face-api.js");
const { faceDetectionNet, faceDetectionOptions } = require("./comons2");

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData, loadImage } = require("canvas");
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function getFaceLandMarks(imgBuffer) {
  const refrenceImage = await canvas.loadImage(imgBuffer);
  await faceDetectionNet.loadFromDisk("./weights");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./weights");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./weights");
  const results = await faceapi
    .detectAllFaces(refrenceImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (!results.length) {
    console.log("no face");
    return [];
  } else {
    // console.log("faces", results);
    results.map((result) => {
      delete result.unshiftedLandmarks;
      delete result.landmarks;
    });
    return results;
  }
}

// create FaceMatcher with automatically assigned labels
// from the detection results for the reference image
// const faceMatcher = new faceapi.FaceMatcher(results);

module.exports.getFaceLandMarks = getFaceLandMarks;
