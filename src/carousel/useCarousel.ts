import React, { useEffect, useRef, useState } from "react"
import animateScrollTo from 'animated-scroll-to';
import 'robot3/debug';
import 'robot3/logging';
import { action, createMachine, immediate, reduce, state, transition } from "robot3";
import { useMachine } from 'react-robot';

interface useCarouselOptions {
    debug?: boolean;
}

const _scrollTo = (n: number, sections, targetRef, options = {}) => {
    // console.log(n, sections,targetRef.current)
    if (targetRef.current && n >= 0 && n < sections.length) {
        // log("go to item " + n)
        animateScrollTo(sections[n], { elementToScroll: targetRef.current, ...options })
    }
}

const moveNext = (ctx, ev) => {
    return { ...ctx, target: ctx.current + 1 }
}

const movePrev = (ctx, ev) => {
    return { ...ctx, target: ctx.current - 1 }
}

const goPosEvent = (ctx, ev) => {
    return { ...ctx, target: ev.value }
}

const recalcPos = (ctx, ev) => {
    return { ...ctx, target: ctx.current }
}

const scr = (ctx, ev) => {
    const sections = ctx.targetRef.current.children
    _scrollTo(ctx.target, sections, ctx.targetRef)
}

const getCurrent = (ctx, ev) => {
    const e = ev.value
    let current

    // Grab the position yo are scrolled to (the top of the viewport)
    let posLeft = e.currentTarget.scrollLeft;
    // console.log(e.currentTarget)
    const sections = e.currentTarget.children

    for (let i = 0, l = sections.length; i < l; i++) {
        let relativePos = sections[i].offsetLeft + sections[i].offsetWidth - posLeft

        // Check if the point we found falls within the section
        if (relativePos >= 0 && relativePos > (sections[i].offsetWidth / 2)) {
            current = i
            break;
        }
    }

    return { ...ctx, current }
}

const recalScroll = (ctx, ev) => {
    const e = ev.value
    const pos = ctx.pos

    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    // log(dx, dy)
    e.currentTarget.scrollTop = pos.top - dy;
    e.currentTarget.scrollLeft = pos.left - dx;
}

const getPos = (ctx, ev) => {
    const e = ev.value
    return {
        ...ctx,
        pos: {
            // The current scroll
            left: e.currentTarget.scrollLeft,
            top: e.currentTarget.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        }
    }
}

const scrollMachine = createMachine('idle', {
    idle: state(
        transition('SCROLL', 'scrollMode', reduce(getCurrent)),
        transition('PREV', 'goTarget', reduce(movePrev)),
        transition('NEXT', 'goTarget', reduce(moveNext)),
        transition('GO', 'goTarget', reduce(goPosEvent)),
        transition('DOWN', 'pressMode', reduce(getPos)),
    ),
    pressMode: state(
        transition('SCROLL', 'pressMode', reduce(getCurrent)),
        transition('MOVE', 'pressMode', action(recalScroll)),
        transition('OUT', 'setNewTarget'),
        transition('UP', 'setNewTarget'),
    ),
    scrollMode: state(
        transition('SCROLL', 'scrollMode', reduce(getCurrent)),
        transition('SCROLL_OUT', 'setNewTarget'),
    ),
    setNewTarget: state(
        immediate('goTarget', reduce(recalcPos))
    ),
    goTarget: state(
        immediate('idle', action(scr))
    )
}, (initialContext) => ({
    targetRef: initialContext.targetRef,
}))

export const useCarousel = (options: useCarouselOptions = {}) => {

    const { debug = false } = options
    const log = debug ? console.log : (a: any) => null

    // maybe if complexity grows (more 'flags') a FSM should be a good idea
    const [infinite, setInfinite] = useState(false)
    const [pressed, setPressed] = useState(false)
    const [stopScrolling, setStopScrolling] = useState(false)

    const [scrollingTimer, setScrollingTimer] = useState({ s: null, stop: false })

    const [_current, setCurrent] = useState(0)
    const [_preload, setPreload] = useState(1)
    const current = infinite ? _current - 1 : _current

    const targetRef = useRef<any>(null)
    const [pos, setPos] = useState({ top: 0, left: 0, x: 0, y: 0 })

    useEffect(() => {
        log("current " + current)

        if (infinite && !pressed) {
            const sections = targetRef.current.children
            if (_current == sections.length - 2 * _preload + 1) {
                log('go init')
                setTimeout(() => {
                    _scrollTo(1, sections, { maxDuration: 0, minDuration: 0 })
                }, 100)
            }

            if (_current == 0) {
                log('go end')
                setTimeout(() => {
                    _scrollTo(sections.length - 2 * _preload, sections, { maxDuration: 0, minDuration: 0 })
                }, 100)
            }

        }
    }, [_current, pressed])

    const [c2, sendScroll] = useMachine(scrollMachine, { targetRef });

    const handlers = {
        ref: targetRef, //BUG: this not resolve on refresh/cache/unmount, needs unmount logic? (?)
        onMouseDown: (e: any) => {
            sendScroll({ type: 'DOWN', value: e })
        },
        onMouseUp: (e: any) => {
            sendScroll({ type: 'UP', value: e })
        },
        onMouseMove: (e: any) => {
            // e.preventDefault()
            sendScroll({ type: 'MOVE', value: e })
        },
        onMouseOut: (e: any) => {
            sendScroll({ type: 'OUT', value: e })
            sendScroll('SCROLL_OUT')
        },
        onScroll: (e: any) => {
            sendScroll({ type: 'SCROLL', value: e })

            // Clear our timeout throughout the scroll
            clearTimeout(scrollingTimer.s);

            // Set a timeout to run after scrolling ends
            setScrollingTimer({
                s: setTimeout(function () {
                    // Run the callback
                    // if (c1.name != 'pressed')
                    sendScroll('SCROLL_OUT')
                }, 66)
            })
        },
    }

    const scrollTo = (n: number, options = {}) => {
        sendScroll({ type: 'GO', value: n })
    }

    const scrollNext = () => {
        sendScroll('NEXT')
    }

    const scrollPrev = () => {
        sendScroll('PREV')
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

    const useInfinite = (slides: React.ReactNode[], preload = 1): React.ReactNode[] => {
        const slidesWithClones = [...slides]
        slidesWithClones.unshift(...slidesWithClones.slice(slidesWithClones.length - preload, slidesWithClones.length))
        slidesWithClones.push(...slidesWithClones.slice(preload, 2 * preload))

        useEffect(() => {
            log('infinite mode')
            setInfinite(true)
            setPreload(preload)
            const sections = targetRef?.current?.children

            _scrollTo(preload, sections, { maxDuration: 0, minDuration: 0 })
        }, [])
        return slidesWithClones
    }

    return { handlers, current, scrollTo, useInfinite, scrollNext, scrollPrev }
}