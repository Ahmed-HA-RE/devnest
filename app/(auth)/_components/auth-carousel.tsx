'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';

const slides = [
  { title: 'Everything you know, finally in one place.' },
  { title: 'Stop losing what you learn.' },
];

const AuthCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // eslint-disable-next-line
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className='flex h-full'
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
    >
      <CarouselContent className='ml-0 h-full'>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className='relative h-full pl-0'>
            <Image
              src='/svg/auth-layout.svg'
              alt={slide.title}
              loading='eager'
              fill
              className='object-cover'
              priority
            />

            <div className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 to-transparent' />

            <div className='absolute inset-x-8 bottom-10 flex flex-col items-center gap-10 text-white'>
              <h3 className='text-4xl max-w-sm text-center leading-snug'>
                {slide.title}
              </h3>

              {/* Dots Navigation */}
              <div className='flex gap-2'>
                {slides.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    className={cn(
                      'h-1.5 w-12 cursor-pointer rounded-full transition-colors duration-500 ease-in-out',
                      dotIndex === current
                        ? 'bg-white'
                        : 'bg-white/30 hover:bg-white',
                    )}
                    onClick={() => api?.scrollTo(dotIndex)}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default AuthCarousel;
