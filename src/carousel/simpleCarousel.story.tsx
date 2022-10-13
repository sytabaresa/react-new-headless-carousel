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

    const Simple = ({ current }: { current: number }) => {
        const { handlers, scrollTo } = useCarousel()


        useEffect(() => {
            scrollTo(current)
        }, [current])


        return <div
            className="carousel w-40"
            {...handlers}
        >
            {range(5).map(i =>
                <div className="carousel-item w-full h-40 m-2">
                    <ExampleElement n={i + 1} />
                </div>
            )}

        </div>
    }

    const SimpleControls = ({ current }: { current: number }) => {
        const { handlers, scrollNext, scrollPrev, scrollTo } = useCarousel()

        useEffect(() => {
            scrollTo(current)
        }, [current])

        return <div className="flex items-center justify-center">
            <div
                className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                onClick={() => scrollPrev()}
            >{"<"}</div>
            <div
                className="carousel w-40"
                {...handlers}
            >
                {range(5).map(i =>
                    <div className="carousel-item w-full h-40 m-2">
                        <ExampleElement n={i + 1} />
                    </div>
                )}
            </div>
            <div
                className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                onClick={() => scrollNext()}
            >{">"}</div>
        </div>
    }

    const SimpleDots = ({ current }: { current: number }) => {
        const { handlers, scrollNext, scrollPrev, scrollTo, current: _current } = useCarousel()

        useEffect(() => {
            scrollTo(current)
        }, [current])

        console.log('ree')
        const items = range(5).map(i =>
            <div className="carousel-item w-full h-40 m-2">
                <ExampleElement n={i + 1} />
            </div>
        )
        return <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
                <div
                    className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                    onClick={() => scrollPrev()}
                >{"<"}</div>
                <div
                    className="carousel w-40"
                    {...handlers}
                >
                    {items}
                </div>
                <div
                    className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                    onClick={() => scrollNext()}
                >{">"}</div>
            </div>
            <div className="flex">
                {range(items.length - 1).map(i =>
                    <div
                        className={`w-2 h-2 mx-1 rounded-full  bg-white ${_current == i ? '' : 'opacity-50'}`}
                        onClick={() => scrollTo(i)}
                    >
                    </div>
                )}

            </div>
        </div>
    }

    return (
        <>
            <Variant name="Single Item" description="Single Item carousel">
                <Simple current={_current} />
            </Variant>
            <Variant name="Single Item with controls" description="Single Item carousel">
                <SimpleControls current={_current} />
            </Variant>
            <Variant name="Single Item with controls and dots" description="Single Item carousel">
                <SimpleDots current={_current} />
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