"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectCarouselProps {
    projects: Project[]
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [rotation, setRotation] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [startRotation, setStartRotation] = useState(0)

    const containerRef = useRef<HTMLDivElement>(null)
    const requestRef = useRef<number>(0)

    // Configuration
    const CARD_WIDTH = 300
    // Fix radius calculation for small number of items to avoid Infinity (tan(PI) = 0)
    const radius = projects.length > 2
        ? (CARD_WIDTH / 2) / Math.tan(Math.PI / projects.length) + 250
        : 400

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.clientX)
        setStartRotation(rotation)
        e.preventDefault() // Prevent text selection
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return
        const deltaX = e.clientX - startX
        // Sensitivity factor: 0.2 degrees per pixel
        setRotation(startRotation + deltaX * 0.2)
    }, [isDragging, startX, startRotation])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Attach global event listeners for drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
        <div
            className="relative h-full w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing group"
            style={{ perspective: "600px" }}
            onMouseDown={handleMouseDown}
        >
            {/* Vignette & Spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,background_100%)] pointer-events-none z-10 opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* 3D Scene */}
            <div
                className="relative w-full h-full flex items-center justify-center pointer-events-none z-20"
                style={{ transformStyle: "preserve-3d" }}
            >
                <div
                    ref={containerRef}
                    className="relative flex items-center justify-center pointer-events-auto"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateY(${rotation}deg)`,
                        transition: isDragging ? "none" : "transform 0.1s linear"
                    }}
                >
                    {projects.map((project, index) => {
                        const angle = (360 / projects.length) * index

                        // Calculate relative angle to determine visibility (Backface culling)
                        // Normalize angle to -180 to 180
                        let relativeAngle = (angle + rotation) % 360
                        if (relativeAngle > 180) relativeAngle -= 360
                        if (relativeAngle < -180) relativeAngle += 360

                        // Only show items within ~100 degrees of the center view
                        const isVisible = Math.abs(relativeAngle) < 100

                        return (
                            <CarouselItem
                                key={project.id}
                                project={project}
                                angle={angle}
                                radius={radius}
                                isActive={activeIndex === index}
                                isVisible={isVisible}
                                onHover={(isHovering) => setActiveIndex(isHovering ? index : null)}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Detail Overlay (Side Panel) */}
            {activeIndex !== null && projects[activeIndex] && (
                <div className="absolute bottom-10 right-6 md:bottom-20 md:right-20 max-w-xs md:max-w-sm bg-background/80 backdrop-blur-md p-8 border-l border-primary/20 z-50 animate-in fade-in slide-in-from-right-10 duration-500 pointer-events-none">
                    <span className="text-xs font-mono text-primary mb-2 block">0{activeIndex + 1}</span>
                    <h3 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">{projects[activeIndex].title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                        {projects[activeIndex].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {projects[activeIndex].tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider border border-border/50 px-3 py-1 rounded-full text-muted-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                    {projects[activeIndex].liveUrl && (
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-primary group-hover:underline underline-offset-4">
                            View Project <ArrowUpRight className="w-3 h-3" />
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none select-none z-30">
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/80">Drag to Explore</span>
            </div>
        </div>
    )
}

interface CarouselItemProps {
    project: Project
    angle: number
    radius: number
    isActive: boolean
    isVisible: boolean
    onHover: (isHovering: boolean) => void
}

function CarouselItem({ project, angle, radius, isActive, isVisible, onHover }: CarouselItemProps) {
    return (
        <div
            className={`absolute top-1/2 left-1/2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(-${radius}px)`,
                transformStyle: "preserve-3d"
            }}
        >
            <div
                className={`relative w-[280px] md:w-[350px] aspect-[4/3] bg-secondary/20 overflow-hidden transition-all duration-500 ease-out ${isActive ? "scale-110 border border-primary/50 shadow-2xl shadow-primary/10 z-10" : "opacity-60"
                    }`}
                onMouseEnter={() => onHover(true)}
                onMouseLeave={() => onHover(false)}
            >
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 280px, 350px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-serif text-muted-foreground/20">
                        {project.title.charAt(0)}
                    </div>
                )}

                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
            </div>
        </div>
    )
}
