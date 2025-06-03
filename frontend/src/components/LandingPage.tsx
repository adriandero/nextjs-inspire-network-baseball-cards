"use client";

import { SanityDocument } from "next-sanity";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { GoArrowRight } from "react-icons/go";
import BrittanySamplePDF from "@/../public/BrittanySamplePDF.png";
import AllisonSamplePhone from "@/../public/AllisonSamplePhone.png";
import Image from "next/image";

export default function LandingPage({
  userProfileData,
}: SanityDocument): React.JSX.Element {
  const handleBrowseRedirect = () => {
    redirect("/browse");
  };

  const handleMyCardRedirect = () => {
    redirect(`/tugcards/${userProfileData.profile.uuid}`);
  };

  return (
    <div className="min-h-screen overflow-hidden h-fit">
      {/* Navigation */}
      <NavBar
        userProfileData={userProfileData}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />

      {/* Grid Pattern */}
      <div className="px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            {/* <div className="inline-block border bg-light2 dark-1 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              🚀 Powered by Inspire Network
            </div> */}

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span>Build Champions League Teams with </span>
              <span className="bg-gradient-to-r from-tertiary to-secondary bg-clip-text text-transparent">
                TUG Cards
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
              Just like a tugboat guides massive ships to safety, TUG Cards
              helps you steer your team assessments into clear, actionable
              insights that drive real results.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className=" text-light1 text-xl h-fit w-fit py-2 px-6 rounded-xl group transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-1 flex items-center justify-center gap-3"
                onClick={handleBrowseRedirect}
              >
                {" "}
                Browse Cards
                <GoArrowRight
                  size={40}
                  strokeWidth="1"
                  className="text-light1 w-8 h-4 hover:text-primary hover:scale-110 duration-200"
                />
              </Button>

              {userProfileData?.profile ? (
                <Button
                  variant="ghost"
                  className="text-xl h-fit w-fit py-2 px-6 rounded-xl group transition-all duration-200 border border-mainbackground hover:bg-mainbackground hover:border-light3 hover:-translate-y-1 flex items-center justify-center gap-3"
                  onClick={handleMyCardRedirect}
                >
                  View My Card
                </Button>
              ) : null}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  15
                </div>
                <div className="text-gray-400 text-sm">National Advisors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  10x
                </div>
                <div className="text-gray-400 text-sm">Faster Results</div>
              </div>
            </div>
          </div>

          {/* Right Visual - Phone Mockup */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
            {/* Background PDF Image - Large */}
            <div className="relative z-10 r-0 animate-[float_15s_ease-in-out_infinite]">
              <Image
                src={BrittanySamplePDF}
                alt="TUG Card PDF Sample"
                className="w-[500px] h-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Phone Mockup - Foreground */}
            <div className="absolute z-20 right-20 bottom-24 animate-[float_8s_ease-in-out_infinite_3s]">
              <Image
                src={AllisonSamplePhone}
                alt="TUG Card Mobile View"
                className="w-[140px] h-auto rounded-2xl shadow-lg"
              />
            </div>

            {/* Custom CSS for floating animation */}
            <style jsx>{`
              @keyframes float {
                0%,
                100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
            `}</style>
          </div>
        </div>
      </div>
      {/* Inspire Network Badge */}
      <div className="text-center">
        <div className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-300 px-6 py-3 rounded-2xl font-semibold">
          ⚓ Powered by Inspire Network
        </div>
      </div>
    </div>
  );
}
