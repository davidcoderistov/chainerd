import { useEffect, useRef } from 'react'


export const useDidMountEffect = (callback: () => any, deps: Array<any>) => {
    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) {
            callback()
        } else {
            didMount.current = true
        }
    }, deps)
}