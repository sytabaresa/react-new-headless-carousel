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
    const [_current, setCurrent] = useState(0)


    const MultipleItems = ({ current }: { current: number }) => {
        const { handlers, scrollTo, scrollNext, scrollPrev, current: _current } = useCarousel()

        useEffect(() => {
            scrollTo(current)
        }, [current])

        const items = range(6).map(i =>
            <div className="carousel-item w-40 h-40 m-2">
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
                    className="carousel w-[32rem]"
                    {...handlers}
                >
                    {items}
                </div>
                <div
                    className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                    onClick={() => scrollNext()}
                >{">"}</div>
            </div>
        </div>
    }

    const MultipleItemsScroll = ({ current }: { current: number }) => {
        const { handlers, scrollTo, scrollNext, scrollPrev, current: _current } = useCarousel()

        useEffect(() => {
            scrollTo(current)
        }, [current])

        const items = [
            <div className="carousel-item w-full">
                {range(0, 2).map(i =>
                    <div className="h-40 m-2 w-40">
                        <ExampleElement n={i + 1} />
                    </div>
                )}
            </div>,
            <div className="carousel-item w-full">
                {range(3, 5).map(i =>
                    <div className="h-40 m-2 w-40">
                        <ExampleElement n={i + 1} />
                    </div>
                )}
            </div>,
            <div className="carousel-item w-full">
                {range(6, 8).map(i =>
                    <div className="h-40 m-2 w-40">
                        <ExampleElement n={i + 1} />
                    </div>
                )}
            </div>
        ]
        return <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
                <div
                    className="font-bold bg-white opacity-50 rounded-full h-6 w-6 text-lg text-black flex justify-center items-center m-2"
                    onClick={() => scrollPrev()}
                >{"<"}</div>
                <div
                    className="carousel w-[32rem]"
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
        </div >
    }

    return (
        <>
            <Variant name="Multiple Items" description="Multiple Items carousel">
                <MultipleItems current={_current} />
            </Variant>

            <Variant name="Multiple Items scroll multiple" description="Multiple Items carousel">
                <MultipleItemsScroll current={_current} />
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