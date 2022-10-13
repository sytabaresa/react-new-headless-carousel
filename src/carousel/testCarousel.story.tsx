import type { PageMeta } from '@vitebook/client';
import { Variant } from '@vitebook/preact';
import {
    ControlsAddon,
    eventCallback,
    EventsAddon,
} from '@vitebook/preact/addons';
import { useState, useEffect, JSXInternal } from 'react';
import { useCarousel } from './useCarousel';
import './carousel.css'
import { range } from '../utils';
import { ExampleElement } from './common';

export const __pageMeta: PageMeta = {
    title: 'Simple Carousel',
    description: 'My awesome carousel.',
};

function CarouselStory() {
    // const { handlers, current, scrollTo, scrollNext, scrollPrev, useInfinite } = useCarousel()
    const [_current, setCurrent] = useState(0)

    const { handlers, scrollNext, scrollPrev, scrollTo, current, useInfinite } = useCarousel()

    useEffect(() => {
        scrollTo(_current)
    }, [_current])

    const items = range(5).map(i =>
        <div className="carousel-item w-full h-40 m-2">
            <ExampleElement n={i + 1} />
        </div>
    )

    const slides = useInfinite(items)


    return (
        <>
            <Variant name="Single Item" description="Single Item carousel">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center">
                        <div
                            className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                            onClick={() => scrollPrev()}
                        >{"<"}</div>
                        <div
                            className="carousel w-40"
                            {...handlers}
                        >
                            {/* {items} */}
                            {slides}
                        </div>
                        <div
                            className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                            onClick={() => scrollNext()}
                        >{">"}</div>
                    </div>
                    <div className="flex">
                        {range(items.length - 1).map(i =>
                            <div
                                className={`w-2 h-2 mx-1 rounded-full  bg-white ${current == i ? '' : 'opacity-50'}`}
                                onClick={() => scrollTo(i)}
                            >
                            </div>
                        )}

                    </div>
                </div>
            </Variant>
            <ControlsAddon>
                <label>
                    Current
                    <input
                        type="number"
                        // value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                    />
                </label>
            </ControlsAddon>
        </>
    )
}

CarouselStory.displayName = 'CarouselStory';

export default CarouselStory;