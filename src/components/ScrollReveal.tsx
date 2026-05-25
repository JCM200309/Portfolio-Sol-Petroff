import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainer?: string | RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainer,
  enableBlur = true,
  baseOpacity = 0.6,
  baseRotation = 9,
  blurStrength = 10,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'top 50%',
  wordAnimationEnd = 'top 45%'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let scroller: string | HTMLElement | Window = window;
    if (scrollContainer) {
      if (typeof scrollContainer === 'string') {
        const found = document.querySelector(scrollContainer);
        if (found) scroller = found as HTMLElement;
      } else if (scrollContainer.current) {
        scroller = scrollContainer.current;
      }
    }

    // Animación de rotación del contenedor
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    // Animación de opacidad de las palabras
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, y: 15, willChange: 'opacity, transform' },
      {
        ease: 'none',
        opacity: 1,
        y: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 95%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    // Animación de desenfoque (blur) si está activada
    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 95%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainer, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={`my-4 overflow-hidden ${containerClassName}`}>
      <span className={`inline-block leading-[1.6] ${textClassName}`}>
        {splitText}
      </span>
    </div>
  );
};

export default ScrollReveal;
