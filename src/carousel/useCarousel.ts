import React, { useEffect, useRef, useState } from "react"
import animateScrollTo from 'animated-scroll-to';

export interface useCarouselOptions {
    debug?: boolean;
}

export const useCarousel = (options: useCarouselOptions = {}) => {

    const { debug = true } = options
    const log = debug ? console.log : (a: any) => null

    // maybe if complexity grows (more 'flags') a FSM should be a good idea
    const [infinite, setInfinite] = useState(false)
    const [pressed, setPressed] = useState(false)
    const [stopScrolling, setStopScrolling] = useState(false)

    const [scrollingTimer, setScrollingTimer] = useState({ s: null, stop: false })

    const [_current, setCurrent] = useState(0)
    const current = infinite ? _current - 1 : _current

    const targetRef = useRef<any>(null)
    const [pos, setPos] = useState({ top: 0, left: 0, x: 0, y: 0 })

    useEffect(() => {
        log("current " + current)

        if (infinite && !pressed) {
            const sections = targetRef.current.children
            if (_current == sections.length - 1) {
                log('go init')
                setTimeout(() => {
                    _scrollTo(1, sections, { maxDuration: 0, minDuration: 0 })
                }, 100)
            }

            if (_current == 0) {
                log('go end')
                setTimeout(() => {
                    _scrollTo(sections.length - 2, sections, { maxDuration: 0, minDuration: 0 })
                }, 100)
            }

        }
    }, [_current, pressed])

    useEffect(() => {
        const sections = targetRef.current.children
        if (stopScrolling) {
            if ((infinite && _current != sections.length - 1 && _current != 0) || !infinite) {
                log('stop scrolling')
                _scrollTo(_current, sections)
                setStopScrolling(false)
            }
        }

    }, [stopScrolling])

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
            const sections = targetRef.current.children
            _scrollTo(_current, sections)
        },
        onMouseMove: (e: any) => {
            if (!pressed) return
            e.preventDefault()
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;

            // Scroll the element
            // log(dx, dy)
            e.currentTarget.scrollTop = pos.top - dy;
            e.currentTarget.scrollLeft = pos.left - dx;
        },
        onMouseOut: (e: any) => {
            log('out')
            noSelect(e)
            setStopScrolling(true)
        },
        onScroll: (e: any) => {

            // Clear our timeout throughout the scroll
            clearTimeout(scrollingTimer.s);

            // Set a timeout to run after scrolling ends
            setScrollingTimer({
                s: setTimeout(function () {
                    // Run the callback
                    setStopScrolling(true)
                }, 66)
            })

            // Grab the position yo are scrolled to (the top of the viewport)
            let posLeft = e.currentTarget.scrollLeft;
            // console.log(e.currentTarget)
            const sections = e.currentTarget.children

            for (let i = 0, l = sections.length; i < l; i++) {
                let relativePos = sections[i].offsetLeft + sections[i].offsetWidth - posLeft

                // Check if the point we found falls within the section
                if (relativePos >= 0 && relativePos > (sections[i].offsetWidth / 2)) {
                    setCurrent(i)
                    break;
                }
            }
        },
    }

    const _scrollTo = (n: number, sections, options = {}) => {
        // console.log(options)
        if (targetRef.current && n >= 0 && n < sections.length) {
            log("go to item " + n)
            animateScrollTo(sections[n], { elementToScroll: targetRef.current, ...options })
        }
    }

    const scrollTo = (n: number, options = {}) => {
        const sections = targetRef.current.children
        if (infinite) _scrollTo(n, [...sections].slice(1, sections.length - 1))
        else _scrollTo(n, sections)
    }

    const scrollNext = () => {
        const sections = targetRef.current.children
        _scrollTo(_current + 1, sections)
    }

    const scrollPrev = () => {
        const sections = targetRef.current.children
        _scrollTo(_current - 1, sections)
    }

    // TODO: support generator function
    // type Interatorfn = (current: number, active: boolean) => React.ReactNode
    // const [iteratorFn, setInteratorFn] = useState<{ fn: Interatorfn }>({ fn: (c, a) => null })
    // const [_preload, setPreload] = useState(0)
    // const useInfinite = (fn: Interatorfn, preload: number = 1): React.ReactNode[] => {
    //     useEffect(() => {
    //         const sects = range(preload).map((i) => fn(i, current == i))
    //         scrollTo(0)
    //         setInteratorFn({ fn })
    //         setPreload(preload)
    //         setSections(sects)

    //         // console.log('inf1')
    //     }, [])

    //     return sections!
    // }

    const useInfinite = (slides: React.ReactNode[]): React.ReactNode[] => {
        const slidesWithClones = [...slides]
        slidesWithClones.unshift(slidesWithClones[slidesWithClones.length - 1])
        slidesWithClones.push(slidesWithClones[1])

        useEffect(() => {
            console.log('inf')
            setInfinite(true)
            const sections = targetRef.current.children

            _scrollTo(1, sections, { maxDuration: 0, minDuration: 0 })
        }, [])
        return slidesWithClones
    }

    return { handlers, current, scrollTo, useInfinite, scrollNext, scrollPrev }
}