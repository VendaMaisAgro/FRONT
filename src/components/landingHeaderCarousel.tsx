"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

export default function LandingHeaderCarousel() {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        AutoPlay({
          delay: 4500,
        }),
      ]}
    >
      <CarouselContent className="-ml-0">
        <CarouselItem className="relative flex justify-between basis-full text-white pl-0 aspect-[8/6] sm:aspect-[17/6]">
          <div className="w-full h-1/3 bg-linear-to-t from-neutral-200 to-transparent absolute -bottom-1 z-10"></div>
          <Link href="#" className="w-full h-full">
            <Image
              src="/dailySales.jpg"
              alt="Banner de promoções diárias"
              fill
              className="object-cover object-top"
              quality={100}
            />
          </Link>
        </CarouselItem>
        <CarouselItem className="relative flex justify-between basis-full text-white pl-0 aspect-[9/6] sm:aspect-[17/6]">
          <div className="w-full h-1/3 bg-linear-to-t from-white to-transparent absolute -bottom-1 z-10"></div>
          <Link href="#" className="w-full h-full">
            <Image
              src="/categories.jpg"
              alt="Banner de promoções diárias"
              fill
              className="object-cover object-top"
              quality={100}
            />
          </Link>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
