import React from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import { HighlighterItem, HighlightGroup, Particles } from "./ui/highlighter";

interface ConnectSectionProps {
  onStartAnalysis?: () => void;
  onForYou?: () => void;
}

export function ConnectSection({ onStartAnalysis, onForYou }: ConnectSectionProps = {}) {
  return (
    <section className="relative mx-auto mb-24 mt-8 max-w-6xl">
      <HighlightGroup className="group h-full">
        <div className="group/item h-full" data-aos="fade-down">
          <HighlighterItem className="rounded-3xl p-1">
            <div className="relative z-20 h-full overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 shadow-2xl border border-white/20">
              <Particles
                className="absolute inset-0 -z-10 opacity-20 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-40"
                quantity={100}
                color={"#e879f9"}
                vy={-0.1}
              />

              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center min-h-[400px]">
                {/* Left Column - Chat Mockup */}
                <div className="relative flex items-center justify-center">
                  <div className="relative w-[280px] h-[320px] bg-gradient-to-b from-slate-100 to-slate-200 rounded-[2.5rem] p-6 shadow-xl border-8 border-slate-300">
                    {/* Phone screen effect */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-400 rounded-full"></div>

                    {/* Chat conversation */}
                    <div className="space-y-3 mt-4">
                      {/* Received message */}
                      <div className="flex justify-start">
                        <div className="max-w-[180px] bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md text-sm shadow-md">
                          Hey babe! 😊
                        </div>
                      </div>

                      {/* Sent message */}
                      <div className="flex justify-end">
                        <div className="max-w-[180px] bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-md text-sm shadow-md">
                          Miss you! 💕
                        </div>
                      </div>

                      {/* Received message */}
                      <div className="flex justify-start">
                        <div className="max-w-[180px] bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md text-sm shadow-md">
                          Can't wait to see you tonight
                        </div>
                      </div>

                      {/* Sent message */}
                      <div className="flex justify-end">
                        <div className="max-w-[180px] bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-md text-sm shadow-md">
                          Same here! ❤️
                        </div>
                      </div>

                      {/* Received message */}
                      <div className="flex justify-start">
                        <div className="max-w-[180px] bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md text-sm shadow-md">
                          Love you so much
                        </div>
                      </div>

                      {/* Sent message */}
                      <div className="flex justify-end">
                        <div className="max-w-[180px] bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-md text-sm shadow-md">
                          Love you more! 🥰
                        </div>
                      </div>
                    </div>

                    {/* Floating heart */}
                    <Heart className="absolute -top-4 -right-4 h-8 w-8 text-pink-500 fill-current animate-bounce" />
                  </div>
                </div>

                {/* Right Column - Copy */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-2 text-2xl">
                      <span>🔥</span>
                      <p className="text-lg md:text-xl text-white font-medium">
                        Ever start talking to someone and realize you're both low-key obsessed?
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-2xl">
                      <span>📱</span>
                      <p className="text-lg md:text-xl text-white font-medium">
                        That early stage where every text hits different and you're checking your phone non-stop.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-2xl">
                      <span>💡</span>
                      <p className="text-lg md:text-xl text-white font-medium">
                        I built this Love Meter for that moment — a fun way to see who's giving more energy right now.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-2xl">
                      <span>🫶</span>
                      <p className="text-lg md:text-xl text-white font-medium">
                        I made it 'cause I'm in that stage too, and it felt like a sweet way to share it.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <p className="text-xl md:text-2xl text-white font-semibold">
                        Try it and see: who's really showing more love — you or your person? ✨
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HighlighterItem>
        </div>
      </HighlightGroup>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 px-4">
        <Button
          onClick={onStartAnalysis}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-0"
        >
          <ArrowRight className="w-6 h-6 mr-3" />
          Start Love Analysis
        </Button>

        <Button
          onClick={onForYou}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-0"
        >
          <Heart className="w-6 h-6 mr-3 fill-current" />
          For You, Michales
        </Button>
      </div>
    </section>
  );
}