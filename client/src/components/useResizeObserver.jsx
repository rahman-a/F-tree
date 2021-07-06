import { useState, useEffect } from "react"

const useResizeObserver = ref => {
    const [dimension, setDimension] = useState(null)
    
    useEffect(() => {
        const targetElement = ref.current
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setDimension(entry.contentRect)
            })
        })
        observer.observe(targetElement)
        return () => {
            observer.unobserve(targetElement)
        }
         
    },[ref])   
    
    return dimension
}

export default useResizeObserver
