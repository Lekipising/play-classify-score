import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";

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

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedText, setSelectedText] = useState(null);

  const [processing, setProcessing] = useState(false);

  const sendData = async () => {
    // send data to server
    setProcessing(true);
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      setProcessing(false);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Welcome</title>
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
        {gameStarted && (
          <div className="flex flex-col gap-4 fixed left-[5%]">
            <h2 className="font-semibold text-lg">Choose image</h2>
            <div className="flex flex-col gap-2">
              {preloadImages.map((img) => (
                <OneImage
                  key={img.id}
                  image={img.image}
                  name={img.name}
                  dimensions={{ height: img.height, width: img.width }}
                  setSelectedImage={() => {
                    setSelectedImage(img.name);
                  }}
                  isActivated={selectedImage === img.name}
                />
              ))}
            </div>
          </div>
        )}
        {/* game components */}
        {gameStarted && (
          <section className="h-max slideUp w-max flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-lg">
                Select highest likelyhood object
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
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-lg">Upload video</h2>
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
      className="relative rounded-[10px] max-h-[200px]"
    >
      <Image
        className="rounded-[10px] object-cover object-center"
        width={200}
        height={200}
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
}: {
  name: string;
  isSelected: boolean;
  selectItem: () => void;
  processing: boolean;
}) {
  return (
    <div
      onClick={() => {
        if (!processing) {
          selectItem();
        }
      }}
      className={`p-6 rounded-[40px] transition-all ease-in duration-300 cursor-pointer shadow-lg flex justify-center items-center font-bold ${
        isSelected
          ? "bg-purple-500 text-white scale-105 shadow-me"
          : "bg-white text-[#2b2a2a]"
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
              fill="#fff"
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
