import React, {
  useEffect, useRef 
} from 'react'
import lottie from 'lottie-web'
import pancakesData from 'assets/lottie/pancakes.json'

const Pancakes = () => {

  const lottiePancakesRef = useRef(null)

  useEffect(() => {
    const animData = {
      container: lottiePancakesRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: pancakesData,
    }

    let isThrowing = false

    const anim = lottie.loadAnimation(animData)

    const startAnimation = () => {
      anim.playSegments([0,25],true)
    }
  
    const throwComplete = () => {
      isThrowing = false
      anim.addEventListener('loopComplete',startAnimation)
    }

    const throwPancake = () => {
      if (isThrowing) return

      isThrowing = true
      anim.playSegments([26,140],true)
      anim.addEventListener('loopComplete',throwComplete)
    }

    anim.addEventListener('DOMLoaded',startAnimation)

    lottiePancakesRef.current.style.cursor = 'pointer'
    lottiePancakesRef.current.onclick = throwPancake
  }, [])

  return (
    <>
      <div ref={lottiePancakesRef} />
    </>
  )
}

export default Pancakes
