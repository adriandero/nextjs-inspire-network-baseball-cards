"use client";

import { SanityDocument } from "next-sanity";
import { redirect } from "next/navigation";
import NavBar from "@/src/components/layout/nav-bar";
import { Button } from "@/src/components/shadcn-ui/button";
import { GoArrowRight } from "react-icons/go";
import BrittanySamplePDF from "@/public/images/desktop-sample.jpg";
import AllisonSamplePhone from "@/public/images/phone-sample.jpg";
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
      <NavBar userProfileData={userProfileData} />

      <div className="px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span>Build teams that lead themselves with </span>
              <span className="bg-gradient-to-r from-tertiary to-secondary bg-clip-text text-transparent">
                TUG Cards
              </span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Self-leading teams have great{" "}
              <span className="font-bold text-dark3">people</span> and great{" "}
              <span className="font-bold text-dark3">culture</span>. TUG Cards
              are the simple tool to help leaders make reads and select the
              right people: <br></br> put them in right seats to perform as a{" "}
              <span className="font-bold text-dark3">team</span> under pressure.
            </p>

            <div className="flex flex-col xs:flex-row gap-4">
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

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  15
                </div>
                <div className="text-gray-500 text-sm">National Advisors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-500 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  10x
                </div>
                <div className="text-gray-500 text-sm">Faster Results</div>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] w-full flex items-center justify-center">
            <div className="relative z-10 animate-[float_15s_ease-in-out_infinite]">
              <Image
                src={BrittanySamplePDF}
                alt="TUG Card PDF Sample"
                className="w-[500px] h-auto object-contain rounded-lg shadow-lg"
              />

              <div className="absolute z-10 right-24 -bottom-12 animate-[float_8s_ease-in-out_infinite_3s]">
                <Image
                  src={AllisonSamplePhone}
                  alt="TUG Card Mobile View"
                  className="w-[140px] h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>

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
      <div className="text-center">
        <a
          href={"https://www.inspirenetworkllc.com/"}
          className="inline-block bg-purple-500/10 border mb-8 border-purple-500/30 text-purple-300 px-6 py-3 rounded-2xl font-semibold"
        >
          ⚓ Powered by Inspire Network
        </a>
      </div>
    </div>
  );
}
