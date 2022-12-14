/* eslint-disable no-undef */
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

const preloadImages = [
  {
    id: 0,
    name: "image 1",
    image: "/dog_car.jpeg",
    height: 300,
    width: 300,
  },
  {
    id: 1,
    name: "image 2",
    image: "/dog_cat.jpg",
    height: 300,
    width: 300,
  },
  {
    id: 2,
    name: "image 3",
    image: "/horse_truck.png",
    height: 300,
    width: 300,
  },
  {
    id: 3,
    name: "image 4",
    image: "/plane_bird.webp",
    height: 300,
    width: 300,
  },
];

// airplane, automobile, bird, cat, deer, dog, frog, horse, ship, and truck
const possibleChoices = [
  "airplane",
  "automobile",
  "bird",
  "cat",
  "deer",
  "dog",
  "frog",
  "horse",
  "ship",
  "truck",
];

export default function IndexPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedText, setSelectedText] = useState(null);

  const [processing, setProcessing] = useState(false);

  const [correctAnswer, setCorrectAnswer] = useState(null);

  const sendData = async () => {
    try {
      setCorrectAnswer(null);
      // send data to server
      setProcessing(true);

      const imagePath = preloadImages.filter(
        (img) => img.name === selectedImage.name,
      );

      if (imagePath.length > 0) {
        const res = await axios.post(
          process.env.NODE_ENV === "development"
            ? `http://127.0.0.1:5000/detect`
            : `https://play-api.onrender.com/detect`,
          { id: imagePath[0].image.split("/")[1] },
          {
            headers: {
              "Content-Type": "application/json",
              "Control-Allow-Origin": "*",
            },
          },
        );

        const obj = res.data.results;

        const sortable = [];
        for (const vehicle in obj) {
          sortable.push([vehicle, parseFloat(obj[vehicle])]);
        }

        sortable.sort(function (a, b) {
          return a[1] - b[1];
        });

        setCorrectAnswer(sortable[sortable.length - 1][0]);

        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
      toast.error(
        "The API is currently down. Please try again in a few minutes",
      );
    }
  };

  return (
    <>
      <Head>
        <title>Welcome and Play!</title>
      </Head>
      <main
        className={`text-white justify-center items-center relative min-h-screen flex-col gap-32 flex py-32 px-16 `}
      >
        <div
          className={`flex transition-all ease-in duration-500 absolute flex-col h-max gap-8 justify-center items-center text-center ${
            gameStarted
              ? "top-[5%] left-[5%]"
              : "top-[40%] left-1/2 transform -translate-x-1/2"
          }`}
        >
          <h1 className="text-[72px]">Play & Classify</h1>
          {!gameStarted && (
            <>
              <p className="font-medium">
                Welcome to Play & Classify. This is a fun app to
              </p>
              <button
                onClick={() => setGameStarted(true)}
                className="rounded-[40px] gradient-btn px-12 py-2 text-white font-bold text-xl"
              >
                Start
              </button>
            </>
          )}
        </div>
        {/* preloaded images */}
        {gameStarted && !showChoices && (
          <div className="flex gap-4 slideUp flex-col">
            <h2 className="font-semibold text-lg">Choose image</h2>
            <div className="flex gap-2">
              {preloadImages.map((img) => (
                <OneImage
                  key={img.id}
                  image={img.image}
                  name={img.name}
                  dimensions={{ height: img.height, width: img.width }}
                  setSelectedImage={() => {
                    setSelectedImage(img);
                    setShowChoices(true);
                  }}
                  isActivated={selectedImage?.name === img.name}
                />
              ))}
            </div>
          </div>
        )}
        {/* game components */}
        {showChoices && (
          <section className="h-max relative slideUp w-max flex gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-lg">
                Select most prominent object from the selected image
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {possibleChoices.map((txt, i) => (
                  <OneChoice
                    key={i}
                    name={txt}
                    isSelected={selectedText === txt}
                    selectItem={() => {
                      setSelectedText(txt);
                      // eslint-disable-next-line no-undef
                      setTimeout(() => {
                        sendData();
                      }, 300);
                    }}
                    processing={selectedText === txt ? processing : false}
                    isCorrect={correctAnswer === txt}
                    postProcess={!!correctAnswer}
                  />
                ))}
              </div>
            </div>
            {selectedImage && (
              <div className="absolute right-1/2 translate-x-1/2 -top-32">
                <div className="relative rounded-[10px] w-[100px] h-[100px]">
                  <Image
                    className="rounded-[10px] object-cover object-center"
                    fill
                    src={selectedImage.image}
                    alt={selectedImage.name}
                  />
                </div>
              </div>
            )}
            {correctAnswer && (
              <button
                onClick={() => {
                  setShowChoices(false);
                  setSelectedImage(null);
                  setSelectedText(null);
                  setCorrectAnswer(null);
                }}
                className="bg-[#2b2a2a] font-semibold border-green-500 border-2 absolute right-1/2 translate-x-1/2 -bottom-20 text-white px-8 py-2 rounded-lg"
              >
                Try again
              </button>
            )}
            <div className="flex justify-center mt-8 flex-col items-end">
              {/* legend */}
              <div className="flex gap-2">
                <span>Correct answer:</span>
                <div className="bg-green-500 h-4 w-8 rounded-md" />
              </div>
              <div className="flex gap-2">
                <span>Wrong answer:</span>
                <div className="bg-red-500 h-4 w-8 rounded-md" />
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function OneImage({
  image,
  name,
  setSelectedImage,
  isActivated,
}: {
  image: string;
  name: string;
  dimensions: { width: number; height: number };
  setSelectedImage: () => void;
  isActivated: boolean;
}) {
  return (
    <div
      onClick={() => setSelectedImage()}
      className="relative rounded-[10px] w-[200px] h-[200px]"
    >
      <Image
        className="rounded-[10px] object-cover object-center"
        fill
        src={image}
        alt={name}
      />
      {isActivated && (
        <div className="absolute bg-black/70 inset-0 h-full w-full flex justify-center items-center p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#fff"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function OneChoice({
  name,
  isSelected,
  selectItem,
  processing,
  isCorrect,
  postProcess,
}: {
  name: string;
  isSelected: boolean;
  selectItem: () => void;
  processing: boolean;
  isCorrect: boolean;
  postProcess: boolean;
}) {
  return (
    <div
      onClick={() => {
        selectItem();
      }}
      className={`p-6 bg-white text-[#2b2a2a] rounded-[40px] transition-all ease-in duration-300 cursor-pointer shadow-lg flex justify-center items-center font-bold ${
        postProcess
          ? isCorrect
            ? `bg-green-500 text-white`
            : `${
                isSelected ? `bg-red-500 text-white` : `bg-white text-[#2b2a2a]`
              }`
          : isSelected
          ? `scale-105 shadow-me`
          : ``
      }`}
    >
      <h3>
        {processing ? (
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="transparent"
              strokeWidth="4"
            ></circle>
            <path
              className=""
              fill="#2b2a2a"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          name
        )}
      </h3>
    </div>
  );
}
