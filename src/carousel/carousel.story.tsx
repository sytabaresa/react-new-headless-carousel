import type { PageMeta } from '@vitebook/client';
import { Variant } from '@vitebook/preact';
import {
    ControlsAddon,
    eventCallback,
    EventsAddon,
} from '@vitebook/preact/addons';
import { JSXInternal } from 'react';
import { useState, useEffect } from 'react';
import { children } from 'svelte/internal';
import { useCarousel } from './useCarousel';
import './carousel.css'
import animateScrollTo from 'animated-scroll-to';

export const __pageMeta: PageMeta = {
    title: 'Carousel',
    description: 'My awesome carousel.',
};

function CarouselStory() {
    const { handlers, current, scrollTo, useInfinite } = useCarousel()
    const [_current, setCurrent] = useState(0)


    useEffect(() => {
        scrollTo(_current)
    }, [_current])

    const ExampleElement = ({ n }: { n: number }) => (
        <div className="w-full h-full mx-0 flex items-center justify-center bg-white">
            <h1 className="block text-blue-400 text-2xl font-bold" >{n}</h1>
        </div>
    )

    const range = (i: number) => [...Array(i).keys()]

    return (
        <>
            <Variant name="Single Item" description="Single Item carousel">
                <div
                    id="test-carousel"
                    className="carousel w-40"
                    {...handlers}
                >
                    {range(6).map(i =>
                        <div className="carousel-item w-full h-40">
                            <ExampleElement n={i + 1} />
                        </div>
                    )}

                </div>
            </Variant>
            <ControlsAddon>
                <label>
                    Current
                    <input
                        type="number"
                        value={_current}
                        onChange={(e) => setCurrent(e.target.value)}
                    />
                </label>
            </ControlsAddon>
        </>
    )
}

CarouselStory.displayName = 'CarouselStory';

export default CarouselStory;