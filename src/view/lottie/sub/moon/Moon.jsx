import React, {
  useEffect, useRef 
} from 'react'
import lottie from 'lottie-web'
import moonData from 'assets/lottie/moon.json'
import styles from './moon.module.sass'

const Moon = () => {
  const lottieMoonRef = useRef(null)
  const lottiePlayBtn = useRef(null)

  useEffect(() => {
    const animMoon = lottie.loadAnimation({
      container: lottieMoonRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: moonData,
    })
    animMoon.setSpeed(0.5)

    const playAnim = () => {
      animMoon.stop()
      animMoon.play()
    }

    if (lottiePlayBtn.current) lottiePlayBtn.current.onclick = playAnim
  }, [])

  return (
    <div className={styles.moonContainer}>
      <div className={styles.moon} ref={lottieMoonRef} />
      <button ref={lottiePlayBtn} className={styles.playBtn}>PLAY</button>
    </div>
  )
}

export default Moon
