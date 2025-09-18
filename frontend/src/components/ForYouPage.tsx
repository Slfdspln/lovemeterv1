import { useState } from 'react'
import { MatrixText } from './ui/matrix-text'
import { Button } from './ui/Button'
import { ArrowLeft, Heart } from 'lucide-react'

interface ForYouPageProps {
  onBack: () => void
}

export function ForYouPage({ onBack }: ForYouPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // All images from the 'him' folder
  const images = [
    { src: "/images/him/IMG_0117.PNG", caption: "Beautiful moment captured" },
    { src: "/images/him/IMG_0621.JPG", caption: "Sweet memories" },
    { src: "/images/him/IMG_0625.JPG", caption: "Love in every frame" },
    { src: "/images/him/IMG_0653.JPG", caption: "Perfect together" },
    { src: "/images/him/IMG_9824.JPG", caption: "Cherished moments" },
    // Note: HEIC files might need conversion for web display
    // Adding the JPG/PNG ones that work well in browsers
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Love Meter
          </Button>
          <div className="flex items-center gap-2 text-pink-600">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-semibold">For You, Michales</span>
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Matrix Text */}
        <div className="text-center mb-12">
          <MatrixText
            text="I love you, Michales."
            className="mb-4"
            initialDelay={200}
            letterAnimationDuration={500}
            letterInterval={100}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            A collection of our precious moments together. Each photo tells a story
            of love, laughter, and the beautiful journey we share.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-700 text-center font-medium">
                  {image.caption}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Love Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 fill-current" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Every Picture Tells Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed">
            These moments captured in time remind me of all the reasons why I love you.
            From spontaneous adventures to quiet moments together, each memory is a
            treasure that makes our love story even more beautiful.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-pink-600">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-semibold">With all my love</span>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}