"use client"

import { Button } from "@/components/ui/button"
import Spline from '@splinetool/react-spline'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Utility function to split text into characters wrapped in spans
const splitTextIntoCharacters = (text: string) => {
    return text.split(' ').map((word, wordIndex) => (
        <div key={wordIndex} className="inline-block overflow-hidden mr-2">
            {word.split('').map((char, charIndex) => (
                <span
                    key={charIndex}
                    className="inline-block transform translate-y-[100%] opacity-0"
                    data-char
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    ))
}

export function Hero() {
    const [splineError, setSplineError] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const titleRef = useRef<HTMLDivElement>(null)
    const topRightRef = useRef<HTMLDivElement>(null)
    const bottomLeftRef = useRef<HTMLDivElement>(null)
    const bottomRightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsClient(true)

        // Preserve WebGL context
        const preserveWebGL = () => {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
            if (gl) {
                gl.getExtension('WEBGL_lose_context')
            }
        }

        preserveWebGL()
    }, [])

    useEffect(() => {
        if (isClient) {
            // GSAP Animation Timeline
            const tl = gsap.timeline({ delay: 0.5 })

            // Animate title characters
            if (titleRef.current) {
                const titleChars = titleRef.current.querySelectorAll('[data-char]')
                tl.to(titleChars, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    stagger: 0.03
                }, 0)
            }

            // Animate top right text characters
            if (topRightRef.current) {
                const topRightChars = topRightRef.current.querySelectorAll('[data-char]')
                tl.to(topRightChars, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    stagger: 0.02
                }, 0.3)
            }

            // Animate bottom left button characters
            if (bottomLeftRef.current) {
                const button = bottomLeftRef.current.querySelector('button')
                if (button) {
                    // Set initial state for button
                    gsap.set(button, {
                        scale: 0,
                        opacity: 0,
                        rotation: -180
                    })

                    // Button animation with 3s delay
                    tl.to(button, {
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        duration: 1,
                        ease: "elastic.out(1, 0.5)",
                        delay: 1
                    }, 1)
                }
            }

            // Animate bottom right text characters
            if (bottomRightRef.current) {
                const bottomRightChars = bottomRightRef.current.querySelectorAll('[data-char]')
                tl.to(bottomRightChars, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    stagger: 0.02
                }, 0.9)
            }
        }
    }, [isClient])

    const handleSplineError = () => {
        console.warn('Spline failed to load, showing fallback content')
        setSplineError(true)
    }

    if (!isClient) {
        return null // Prevent hydration mismatch
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Spline Interactive Background Element */}
            <div
                id="spline-background"
                className="absolute inset-0 z-10"
                aria-label="Interactive 3D background using Spline"
            >
                {!splineError ? (
                    <Spline
                        scene="https://prod.spline.design/g6IsbdpUSAjlpZPU/scene.splinecode"
                        onError={handleSplineError}
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-4xl">☕</span>
                            </div>
                            <p className="text-gray-600 text-lg">Interactive 3D Experience</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="relative z-20 h-full w-full pointer-events-none">
                {/* Top Left - Title */}
                <div ref={titleRef} className="absolute top-20 left-4 sm:left-0 lg:left-2 max-w-md pointer-events-auto">
                    <h1 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
                        {splitTextIntoCharacters("YOUR ONE STOP COFFEE SOLUTIONS.")}
                    </h1>
                </div>

                {/* Top Right - Text */}
                <div ref={topRightRef} className="absolute top-30 right-4 sm:right-6 lg:right-0 max-w-sm text-left pointer-events-auto">
                    <div className="text-lg text-gray-700 font-medium">
                        {splitTextIntoCharacters("Advanced analytics and insights for your coffee business")}
                    </div>
                </div>

                {/* Bottom Left - CTA Button */}
                <div ref={bottomRightRef} className="w-[350px] absolute top-200 left-4 sm:left-0 lg:left-8 pointer-events-auto">
                    <div className="text-base text-gray-600">
                        {splitTextIntoCharacters("Transform your coffee machine operations with data-driven insights")}
                    </div>
                </div>

                {/* Bottom Right - Text */}
                <div ref={bottomLeftRef} className=" absolute top-180 right-16 sm:right-[-60px] max-w-sm text-left pointer-events-auto">

                    <Button
                        size="lg"
                        className="text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90"
                    >
                        See Product
                    </Button>
                </div>
            </div>
        </section>
    )
} 