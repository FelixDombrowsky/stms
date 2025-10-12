import { Liquid } from '@ant-design/plots'
import React, { useMemo } from 'react'

// const DemoLiquid = React.memo(({ theme, waterColor, volume, capacity }) => {
//   const percent = capacity > 0 ? parseFloat((volume / capacity).toFixed(2)) : 0

//   const config = useMemo(
//     () => ({
//       percent,
//       width: 140,
//       height: 140,
//       // animation: false, // ปิด animation ตอน render ใหม่
//       // liquidStyle: { transition: 'none' },
//       // statistic: {
//       //   content: {
//       //     style: {
//       //       transition: 'none',
//       //     },
//       //   },
//       // },
//       style: {
//         outlineBorder: 4,
//         outlineDistance: 2,
//         waveLength: 130,
//         textFill: theme === 'dark' ? '#ffffff' : '#000000',
//         fill: waterColor,
//         stroke: waterColor,
//       },
//     }),
//     [percent, theme, waterColor],
//   )

//   return <Liquid {...config} />
// })

// const DemoLiquid = ({ theme, waterColor, volume, capacity }) => {
//   const percent = capacity > 0 ? parseFloat((volume / capacity).toFixed(2)) : 0

//   if (isNaN(percent) || percent < 0) {
//     percent = 0
//   }
//   if (percent > 1) {
//     percent = 1
//   }

//   const config = {
//     percent,
//     width: 150,
//     height: 150,
//     style: {
//       outlineBorder: 4,
//       outlineDistance: 2,
//       waveLength: 100,
//       textFill: theme === 'dark' ? '#ffffff' : '#000000',
//       fill: waterColor,
//       stroke: waterColor,
//     },
//   }

//   return <Liquid {...config} />
// }

const DemoLiquid = React.memo(
  ({ theme, waterColor, volume, capacity }) => {
    console.log('DemoLiquid', {
      theme,
      waterColor,
      volume,
      capacity,
    })

    let percent = parseFloat((parseFloat(volume) / parseFloat(capacity)).toFixed(2))

    if (isNaN(percent) || percent < 0) {
      percent = 0
    }
    if (percent > 1) {
      percent = 1
    }

    const config = {
      percent,
      width: 150,
      height: 150,
      style: {
        outlineBorder: 4,
        outlineDistance: 2,
        waveLength: 100,
        textFill: theme === 'dark' ? '#ffffff' : '#000000',
        fill: waterColor,
        stroke: waterColor,
      },
    }

    return <Liquid {...config} />
  },
  (prevProps, nextProps) => {
    return (
      prevProps.volume === nextProps.volume &&
      prevProps.capacity === nextProps.capacity &&
      prevProps.waterColor === nextProps.waterColor &&
      prevProps.theme === nextProps.theme
    )
  },
)

export default DemoLiquid
