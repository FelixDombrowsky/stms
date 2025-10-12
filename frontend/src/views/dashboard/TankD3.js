import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const TankD3 = ({ theme, waterColor, volume, capacity }) => {
  const tankRef = useRef(null)

  useEffect(() => {
    drawTank()
  }, [theme, waterColor, volume, capacity])

  const drawTank = () => {
    const container = d3.select(tankRef.current)
    container.selectAll('*').remove()

    const width = 140
    const height = 140
    const borderWidth = 3

    const tankRx = width / 2 - borderWidth
    const tankRy = height / 2 - borderWidth

    const percent = capacity > 0 ? Math.min(volume / capacity, 1) * 100 : 0
    const waterY = d3.scaleLinear().domain([0, 100]).range([height, 0])(percent)

    console.log({ volume, capacity, percent, waterY, tankRx, tankRy })

    const svg = container.append('svg').attr('width', width).attr('height', height)

    const group = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)

    // tank border
    group
      .append('ellipse')
      .attr('rx', tankRx)
      .attr('ry', tankRy)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', borderWidth)

    // background
    group
      .append('ellipse')
      .attr('rx', tankRx - borderWidth)
      .attr('ry', tankRy - borderWidth)
      .attr('fill', theme === 'dark' ? '#1e1e1e' : '#f1f1f1')

    // clip path
    const clipId = `clip-${Math.random().toString(36).slice(2, 9)}`
    const defs = svg.append('defs')
    defs
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('x', width / 2 - tankRx) // ซ้ายสุดของวงรี
      .attr('y', height / 2 + tankRy - (percent / 100) * (tankRy * 2)) // จากก้นวงรีขึ้นมา
      .attr('width', tankRx * 2)
      .attr('height', (percent / 100) * (tankRy * 2))

    // debug rect (ทับตำแหน่งจริง)
    svg
      .append('rect')
      .attr('x', width / 2 - tankRx)
      .attr('y', height / 2 + tankRy - (percent / 100) * (tankRy * 2))
      .attr('width', tankRx * 2)
      .attr('height', (percent / 100) * (tankRy * 2))
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-dasharray', '4 2')

    // น้ำ
    group
      .append('ellipse')
      .attr('rx', tankRx - borderWidth)
      .attr('ry', tankRy - borderWidth)
      .attr('fill', waterColor)
      .attr('clip-path', `url(#${clipId})`)

    // ข้อความ %
    group
      .append('text')
      .text(`${percent.toFixed(0)}%`)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', theme === 'dark' ? '#fff' : '#003B42')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
  }

  return <div ref={tankRef}></div>
}

export default TankD3
