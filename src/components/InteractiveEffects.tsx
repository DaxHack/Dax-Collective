// src/components/InteractiveEffects.tsx
"use client"; // Mark this as a client component

import { useEffect } from "react";

export default function InteractiveEffects() {
  useEffect(() => {
    // --- Enhanced Color splash effect on click ---
    const handleSplashClick = (e: MouseEvent) => {
      const splash = document.createElement("div");
      splash.classList.add("splash-effect");
      
      const colors = [
        "rgba(255, 126, 95, 0.7)", "rgba(123, 104, 238, 0.7)", 
        "rgba(0, 201, 167, 0.7)", "rgba(255, 107, 107, 0.7)",
        "rgba(254, 180, 123, 0.7)", "rgba(155, 89, 182, 0.7)",
        "rgba(146, 254, 157, 0.7)", "rgba(255, 142, 142, 0.7)"
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      splash.style.background = randomColor;
      splash.style.left = e.pageX + "px";
      splash.style.top = e.pageY + "px";
      
      document.body.appendChild(splash);
      
      setTimeout(() => {
        splash.remove();
      }, 800);
    };
    document.addEventListener("click", handleSplashClick);

    // --- Enhanced 3D card tilt effect with parallax ---
    const handleCardMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 8;
      const rotateY = (centerX - x) / 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      const cardImg = card.querySelector(".card-img") as HTMLElement; // Assuming card images have this class
      if (cardImg) {
        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;
        cardImg.style.transform = `translateX(${moveX}px) translateY(${moveY}px) scale(1.1)`;
      }
    };

    const handleCardMouseLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      
      const cardImg = card.querySelector(".card-img") as HTMLElement;
      if (cardImg) {
        cardImg.style.transform = "";
      }
    };

    // Need to select cards dynamically as they might appear/disappear with navigation
    const observer = new MutationObserver(() => {
      const cards = document.querySelectorAll(".card"); // Re-query cards on DOM changes
      cards.forEach(card => {
        // Remove old listeners before adding new ones to prevent duplicates
        card.removeEventListener("mousemove", handleCardMouseMove as EventListener);
        card.removeEventListener("mouseleave", handleCardMouseLeave as EventListener);
        card.addEventListener("mousemove", handleCardMouseMove as EventListener);
        card.addEventListener("mouseleave", handleCardMouseLeave as EventListener);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Initial query
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("mousemove", handleCardMouseMove as EventListener);
        card.addEventListener("mouseleave", handleCardMouseLeave as EventListener);
    });

    // --- Glow effect following cursor ---
    const glowEffect = document.createElement("div");
    glowEffect.classList.add("glow-effect");
    document.body.appendChild(glowEffect);

    const handleGlowMouseMove = (e: MouseEvent) => {
      glowEffect.style.opacity = "0.15";
      glowEffect.style.left = e.pageX - 75 + "px";
      glowEffect.style.top = e.pageY - 75 + "px";
    };
    const handleGlowMouseOut = () => {
      glowEffect.style.opacity = "0";
    };
    document.addEventListener("mousemove", handleGlowMouseMove);
    document.addEventListener("mouseout", handleGlowMouseOut);

    // --- Smooth scrolling for navigation (handled by Next.js Link, but keep for potential anchor links within pages) ---
    const handleSmoothScrollClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute("href")!); // Non-null assertion
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100, // Adjust offset as needed
            behavior: "smooth"
          });
        }
      }
    };
    document.addEventListener("click", handleSmoothScrollClick);

    // --- Intersection Observer for fade-in animations ---
    const fadeElements = document.querySelectorAll(".section-title, .card, .featured-item, .scripture-card, .app-content, .app-img, .hero-content, .blog-post-card"); // Add relevant selectors
    
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      fadeObserver.observe(el);
    });

    // --- Interactive hover effects for buttons (mostly handled by CSS, but add JS for complex effects if needed) ---
    // Example: Add subtle scale/shadow on hover via JS if needed
    // document.querySelectorAll(".btn, .card-btn").forEach(button => { ... });

    // Cleanup function to remove listeners when component unmounts
    return () => {
      document.removeEventListener("click", handleSplashClick);
      observer.disconnect(); // Disconnect mutation observer
      document.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("mousemove", handleCardMouseMove as EventListener);
        card.removeEventListener("mouseleave", handleCardMouseLeave as EventListener);
      });
      document.removeEventListener("mousemove", handleGlowMouseMove);
      document.removeEventListener("mouseout", handleGlowMouseOut);
      document.removeEventListener("click", handleSmoothScrollClick);
      fadeElements.forEach(element => fadeObserver.unobserve(element));
      glowEffect.remove();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return null; // This component doesn't render anything itself
}
