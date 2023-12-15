import React, {
  useRef, useEffect
} from 'react'
import clsx from 'clsx'
import Pancakes from 'view/lottie/sub/pancakes'
import Hello from './sub/hello'
import Moon from './sub/moon'
import styles from './lottie.module.sass'

const LottieControl = () => {

  return (
    <div className={styles.lottie}>
      <Pancakes />
      <div className={styles.container}>
        <div className={clsx(styles.anim, styles.left)}>
          <Moon />
        </div>
        <div id={'hello'} className={clsx(styles.anim, styles.right)}>
          <Hello />
          <div className={styles.heightContainer} />
        </div>
      </div>
    </div>
  )
}

export default LottieControl
