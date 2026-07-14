"use client"

import Image from "next/image"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Home() {
  const { user } = useUser()
  const globeRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number>(0)

  // Three.js Globe Animation
  useEffect(() => {
    if (!globeRef.current) return

    const container = globeRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Globe geometry
    const geometry = new THREE.SphereGeometry(1.2, 64, 64)

    // Load world map texture
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"
    )

    // Black and white earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: 0x888888,
      shininess: 5,
      transparent: true,
      opacity: 0.95,
    })

    const globe = new THREE.Mesh(geometry, earthMaterial)
    scene.add(globe)

    // Very subtle atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(1.3, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.02,
      side: THREE.BackSide,
    })
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowSphere)

    // Ambient particles in background (reduced, neutral grey)
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 200
    const particlesPos = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      particlesPos[i * 3] = (Math.random() - 0.5) * 6
      particlesPos[i * 3 + 1] = (Math.random() - 0.5) * 6
      particlesPos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPos, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.2,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Lighting - neutral for black and white look
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Animation loop - smooth rotation only
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // Slow rotation on Y-axis
      globe.rotation.y += 0.001

      // Very subtle particle drift
      particles.rotation.y += 0.0001

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      geometry.dispose()
      earthMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      {/* Three.js Globe Background - positioned to the right */}
      <div
        ref={globeRef}
        className="fixed top-0 right-0 z-0 pointer-events-none"
                style={{ width: "60%", height: "100vh", top: "-10%" }}
      />

      {/* Header - Google Analytics Style */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dadce0] shadow-sm">
        <nav
          className="relative max-w-[1440px] w-full mx-auto px-6 h-16 flex items-center justify-between"
          aria-label="Global"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="WebTrack logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h2 className="font-medium text-xl text-[#202124] tracking-tight">
              WebTrack
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl={"/dashboard"}>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:ring-offset-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Get Started
                </button>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section - GA Style */}
      <main className="relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 pt-20 pb-16">
          {/* Announcement Badge */}
          <div className="flex justify-start mb-8">
            <a
              href="https://tubeguruji.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#dadce0] rounded-full text-sm text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8] transition-colors duration-200 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" />
              A Project By Noor Alam
              <svg
                className="w-4 h-4 text-[#5f6368]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Hero Content - Left aligned to make room for globe */}
          <div className="max-w-2xl text-left">
            <h1 className="text-[#202124] text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight mb-6">
              Know Your Visitors,
              <br />
              <span className="text-[#1a73e8] font-medium">
                Grow Your Business
              </span>
            </h1>

            <p className="text-lg text-[#5f6368] leading-relaxed mb-10 max-w-xl">
              Get real-time insights into your website traffic. Make smarter
              decisions with actionable data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:ring-offset-2"
              >
                {user ? "Go to Dashboard" : "Get started"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-[#dadce0] text-[#1a73e8] text-sm font-medium rounded-md hover:bg-[#f8f9fa] transition-colors duration-200"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid - GA Card Style */}
        <div id="features" className="max-w-[1440px] mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-lg hover:border-[#1a73e8] transition-all duration-300 cursor-pointer">
              <div className="flex justify-center items-center w-12 h-12 bg-[#e8f0fe] rounded-lg mb-5 group-hover:bg-[#1a73e8] transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-[#1a73e8] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect width="10" height="14" x="3" y="8" rx="2" />
                  <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />
                  <path d="M8 18h.01" />
                </svg>
              </div>
              <h3 className="text-[#202124] text-lg font-medium mb-2 group-hover:text-[#1a73e8] transition-colors">
                25+ Templates
              </h3>
              <p className="text-[#5f6368] text-sm leading-relaxed mb-4">
                Responsive, and mobile-first project on the web
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[#1a73e8] font-medium group-hover:underline">
                Learn more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-lg hover:border-[#1a73e8] transition-all duration-300 cursor-pointer">
              <div className="flex justify-center items-center w-12 h-12 bg-[#e8f0fe] rounded-lg mb-5 group-hover:bg-[#1a73e8] transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-[#1a73e8] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 7h-9" />
                  <path d="M14 17H5" />
                  <circle cx="17" cy="17" r="3" />
                  <circle cx="7" cy="7" r="3" />
                </svg>
              </div>
              <h3 className="text-[#202124] text-lg font-medium mb-2 group-hover:text-[#1a73e8] transition-colors">
                Customizable
              </h3>
              <p className="text-[#5f6368] text-sm leading-relaxed mb-4">
                Components are easily customized and extendable
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[#1a73e8] font-medium group-hover:underline">
                Learn more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-lg hover:border-[#1a73e8] transition-all duration-300 cursor-pointer">
              <div className="flex justify-center items-center w-12 h-12 bg-[#e8f0fe] rounded-lg mb-5 group-hover:bg-[#1a73e8] transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-[#1a73e8] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="text-[#202124] text-lg font-medium mb-2 group-hover:text-[#1a73e8] transition-colors">
                Free to Use
              </h3>
              <p className="text-[#5f6368] text-sm leading-relaxed mb-4">
                Every component and plugin is well documented
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[#1a73e8] font-medium group-hover:underline">
                Learn more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-lg hover:border-[#1a73e8] transition-all duration-300 cursor-pointer">
              <div className="flex justify-center items-center w-12 h-12 bg-[#e8f0fe] rounded-lg mb-5 group-hover:bg-[#1a73e8] transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-[#1a73e8] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                </svg>
              </div>
              <h3 className="text-[#202124] text-lg font-medium mb-2 group-hover:text-[#1a73e8] transition-colors">
                24/7 Support
              </h3>
              <p className="text-[#5f6368] text-sm leading-relaxed mb-4">
                Contact us 24 hours a day, 7 days a week
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[#1a73e8] font-medium group-hover:underline">
                Learn more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section - GA Metric Cards */}
        <div className="max-w-[1440px] mx-auto px-6 py-16 border-t border-[#dadce0]">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-light text-[#1a73e8] mb-2">10M+</div>
              <div className="text-[#5f6368] text-sm">Events tracked daily</div>
            </div>
            <div className="p-6 border-x border-[#dadce0]">
              <div className="text-4xl font-light text-[#34a853] mb-2">99.9%</div>
              <div className="text-[#5f6368] text-sm">Uptime guaranteed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-light text-[#f9ab00] mb-2">500+</div>
              <div className="text-[#5f6368] text-sm">Integrations available</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#dadce0] bg-white mt-16">
        <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#5f6368] text-sm">
            © 2025 WebTrack. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[#5f6368]">
            <a href="#" className="hover:text-[#1a73e8] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#1a73e8] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#1a73e8] transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}