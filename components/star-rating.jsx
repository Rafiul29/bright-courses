import Image from 'next/image'
import React from 'react'

const StarRating = ({rating}) => {
  const stars = new Array(rating).fill(0)
  return (
    <>
    {stars.map((star,index)=>(
      <Image key={index}  src={`/assets/star.svg`}  alt='' width={20} height={20} />
    ))}
    </>
  )
}

export default StarRating