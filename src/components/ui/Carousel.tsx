'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

interface CarouselProps {
  items: {
    title: string;
    description: string;
    date?: string;
    tags?: string[];
    link?: string;
    image?: string;
  }[];
  title: string;
  autoPlayInterval?: number;
}

export default function Carousel({ items, title, autoPlayInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = autoPlayInterval > 0 ? setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval) : null;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [items.length, autoPlayInterval]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = items.length - 1;
      if (next >= items.length) next = 0;
      return next;
    });
  };

  return (
    <div className="w-full py-8">
      <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="relative h-[300px] w-full max-w-4xl mx-auto">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full"
          >
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-indigo-100/20 dark:border-indigo-700/20">
              <div className="flex flex-col md:flex-row gap-8">
                {items[currentIndex].image && (
                  <div className="w-full md:w-1/2 relative h-[200px] rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 dark:from-indigo-400/10 dark:to-purple-400/10 z-10"></div>
                    <Image
                      src={items[currentIndex].image}
                      alt={items[currentIndex].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {items[currentIndex].title}
                    </h4>
                    {items[currentIndex].date && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{items[currentIndex].date}</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{items[currentIndex].description}</p>
                  {items[currentIndex].tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {items[currentIndex].tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 text-gray-700 dark:text-gray-200 rounded-full text-sm backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {items[currentIndex].link && (
                    <a
                      href={items[currentIndex].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
          onClick={() => paginate(-1)}
        >
          <FaChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
          onClick={() => paginate(1)}
        >
          <FaChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}