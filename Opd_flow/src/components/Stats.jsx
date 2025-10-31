import { useEffect, useRef, useState } from 'react'
import './Stats.css'

const data = [
  { label: 'Active Patients', value: 15000, suffix: '+' },
  { label: 'Doctors Available', value: 500, suffix: '+' },
  { label: 'Consultations', value: 25000, suffix: '+' },
  { label: 'Satisfaction Rate', value: 98, suffix: '%' }
]

function Stats() {
  const [show, setShow] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [])

  return (
    <section className="stats" ref={ref}>
      <div className="container">
        <div className="grid">
          {data.map((item, i) => (
            <Counter key={i} item={item} show={show} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({ item, show, delay }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!show) return
    const duration = 2000
    const steps = 60
    const increment = item.value / steps
    const stepTime = duration / steps
    const timer = setTimeout(() => {
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= item.value) {
          setCount(item.value)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, stepTime)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [show, item.value, delay])

  return (
    <div className="item">
      <div className="value">{count.toLocaleString()}{item.suffix}</div>
      <div className="label">{item.label}</div>
    </div>
  )
}

export default Stats
