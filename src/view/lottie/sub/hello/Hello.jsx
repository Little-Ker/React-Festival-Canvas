import React, {
  useEffect, useRef 
} from 'react'
import lottie from 'lottie-web'
import helloData from 'assets/lottie/hello.json'

const Hello = () => {
  const lottieHelloRef = useRef(null)

  useEffect(() => {
    const animDuration = 2000
    const animHello = lottie.loadAnimation({
      container: lottieHelloRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: helloData,
    })

    const animateBodyMovie = (duration) => {
      const element = document.getElementById('hello')
      const scrollPosition = element.scrollTop
      const maxFrames = animHello.totalFrames
      const frame = (maxFrames / 100) * (scrollPosition / (duration / 100))
      animHello.goToAndStop(frame, true)
    }

    const onScroll = () => {
      animateBodyMovie(animDuration)
    }

    document.getElementById('hello').addEventListener('scroll', onScroll)

    return () => {
      animHello.destroy()
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div style={{ position: 'sticky',
      top: '0%'}}>
      <div ref={lottieHelloRef} />
    </div>
  )
}

export default Hello
