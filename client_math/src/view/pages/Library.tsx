import React, { useState } from 'react'
import './Library.less'
import ImageEditor from '../components/ImageEditor'

export default function Library () {
  const [image, setImage] = useState<Blob | undefined>(undefined)
  return <div className="library"></div>
}
