import Image from "next/image"
import type { ReactNode } from "react"
import { Brand } from "@/components/brand"

export default function SplitAuthCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 md:bg-background flex flex-col relative overflow-hidden">
      {/* Animated background elements for mobile */}
      <div className="absolute inset-0 md:hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-lg animate-floating delay-500"></div>
      </div>

      {/* Top app bar with centered brand, matching the mock rhythm */}
      <header className="h-12 md:h-14 flex items-center justify-between px-4 md:px-8 relative z-10 backdrop-blur-sm md:backdrop-blur-none">
        <div className="flex-1" />
        <div className="flex-1 flex items-center justify-center transform transition-all duration-500 hover:scale-105">
          <Brand />
        </div>
        <div className="flex-1" />
      </header>

      <section className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-10 relative z-10">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-4">
          {/* Enhanced mobile card with animations and gradients */}
          <div className="bg-white/80 md:bg-[#ffffff] backdrop-blur-sm border border-white/20 md:border-[#d9d9d9] rounded-xl p-6 md:p-8 shadow-xl md:shadow-none transform transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] animate-fadeInUp">
            {/* Mobile gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-blue-50/30 rounded-xl md:hidden"></div>
            
            <div className="relative z-10">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 md:text-[#111827] bg-clip-text text-transparent md:bg-none text-balance transform transition-all duration-500 hover:scale-105">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-gray-600 md:text-[#6c6c6c] transform transition-all duration-500 delay-100 animate-fadeInUp">
                  {subtitle}
                </p>
              ) : null}
              <div className="mt-6 transform transition-all duration-500 delay-200 animate-fadeInUp">
                {children}
              </div>
            </div>
          </div>

          {/* Right visual panel hidden on mobile, as in the Figma variants */}
          <div className="hidden md:block">
            <div className="relative h-full min-h-[420px] rounded-xl overflow-hidden border border-[#d9d9d9] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
              <Image
                src="https://res.cloudinary.com/dlcnv2mkm/image/upload/v1756712247/7b63f1a45bc23337ff246ae8162bec8fa9d7190d_j8alp8.jpg"
                alt="Abstract deep blue waves wallpaper"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
