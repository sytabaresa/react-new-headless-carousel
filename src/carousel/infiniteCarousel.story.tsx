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

export const __pageMeta: PageMeta = {
    title: 'Infinite Carousel',
    description: 'My awesome infinite carousel.',
};

function CarouselStory() {
    const { handlers, current, scrollTo, scrollNext, scrollPrev, useInfinite } = useCarousel()
    const [_current, setCurrent] = useState(0)


    useEffect(() => {
        scrollTo(_current)
    }, [_current])

    const ExampleElement = ({ n }: { n: number }) => (
        <div className="w-full h-full mx-0 flex items-center justify-center bg-white">
            <h1 className="block text-blue-400 text-2xl font-bold" >{n}</h1>
        </div>
    )

    const generator = () =>
    <div className="carousel-item w-full h-40">
                            <ExampleElement n={i + 1} />
                        </div>
    const range = (i: number) => [...Array(i).keys()]

    return (
        <>
            <Variant name="Single Item" description="Single Item carousel">
                <div
                    className="carousel w-40"
                    {...handlers}
                >
                    
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