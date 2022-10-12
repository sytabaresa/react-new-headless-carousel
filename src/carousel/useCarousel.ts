import React, { HTMLAttributes, useEffect, useRef, useState } from "react"
import animateScrollTo from 'animated-scroll-to';

// import { range } from "lodash"
const range = (i: number) => [...Array(i).keys()]

type Interatorfn = (current: number, active: boolean) => React.ReactNode

const log = console.log

export const useCarousel = () => {
    const [pressed, setPressed] = useState(false)
    const [scrollingTimer, setScrollingTimer] = useState({ s: null, stop: false })
    const [scrolling, setScrolling] = useState(false)

    const [iteratorFn, setInteratorFn] = useState<{ fn: Interatorfn }>({ fn: (c, a) => null })

    const [_preload, setPreload] = useState(0)

    const [current, setCurrent] = useState(0)
    const [sections, setSections] = useState<React.ReactNode[]>()

    const targetRef = useRef<any>(null)
    const [pos, setPos] = useState({ top: 0, left: 0, x: 0, y: 0 })

    useEffect(() => {
        log("current " + current)

        //     console.log(current, iteratorFn, sections)
        //     const sects = range(_preload).map((i) => iteratorFn.fn(i, current == i))
        //     setSections(sects)
    }, [current])


    useEffect(() => {
        if (scrolling) {
            scrollTo(current)
            setScrolling(false)
        }

    }, [scrolling])

    const noSelect = (e: any) => {
        setPressed(false)
        // e.currentTarget.style.cursor = "inherit";
        e.currentTarget.style.removeProperty('user-select');
    }

    const handlers = {
        ref: targetRef,
        onMouseDown: (e: any) => {
            setPos({
                // The current scroll
                left: e.currentTarget.scrollLeft,
                top: e.currentTarget.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            })
            setPressed(true)
            // e.currentTarget.style.cursor = "grabbing";
            e.currentTarget.style.userSelect = 'none';
        },
        onMouseUp: (e: any) => {
            noSelect(e)
            scrollTo(current)
        },
        onMouseMove: (e: any) => {
            if (!pressed) return
            e.preventDefault()
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;

            // Scroll the element
            // console.log(dx, dy)
            e.currentTarget.scrollTop = pos.top - dy;
            e.currentTarget.scrollLeft = pos.left - dx;
        },
        onBlur: (e: any) => {
            noSelect(e)
        },
        onScroll: (e: any) => {

            // Clear our timeout throughout the scroll
            clearTimeout(scrollingTimer.s);

            // Set a timeout to run after scrolling ends
            setScrollingTimer({
                s: setTimeout(function () {
                    // Run the callback
                    log('stop scrolling')
                    setScrolling(true)
                }, 66)
            })

            // Grab the position yo are scrolled to (the top of the viewport)
            let posLeft = e.currentTarget.scrollLeft;
            // console.log(e.currentTarget)
            const sections = e.currentTarget.children

            for (let i = 0, l = sections.length; i < l; i++) {
                let relativePos = sections[i].offsetLeft + sections[i].offsetWidth - posLeft

                // log("scroll", i, sections[i].offsetLeft, posLeft, relativePos, sections[i].offsetWidth)
                // Check if the point we found falls within the section
                if (relativePos >= 0 && relativePos > (sections[i].offsetWidth / 2)) {
                    setCurrent(i)
                    break;
                }
            }

            // console.log(e.currentTarget.scrollLeft, e.currentTarget.clientWidth, e.currentTarget.scrollWidth)
            // if (iteratorFn && e.currentTarget.scrollLeft + e.currentTarget.clientWidth >= e.currentTarget.scrollWidth * 0.7) {
            //     setPreload(p => {
            //         setSections(range(p + 1).map((i) => iteratorFn.fn(i, current == i)))
            //         return p + 1
            //     })
            // }
        },
    }

    const scrollTo = (n: number) => {
        const sections = targetRef.current.children
        if (targetRef.current && n > 0 && sections[n]) {
            log("go to item " + n)
            animateScrollTo(sections[n], { elementToScroll: targetRef.current })
        }
    }

    const useInfinite = (fn: Interatorfn, preload: number = 1): React.ReactNode[] => {
        useEffect(() => {
            const sects = range(preload).map((i) => fn(i, current == i))
            scrollTo(0)
            setInteratorFn({ fn })
            setPreload(preload)
            setSections(sects)

            // console.log('inf1')
        }, [])

        return sections!
    }

    return { handlers, current, scrollTo, useInfinite, sections }
}