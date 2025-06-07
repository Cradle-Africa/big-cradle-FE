import { LucideIcon } from 'lucide-react'
import React from 'react'

interface IconProps {
    Icon: LucideIcon,
    label: string
}

const IconComponent: React.FC<IconProps> = ({Icon, label}) => {
  return (
    <div className='flex justify-center'>
        <Icon 
            size={60} 
            className={`${label === 'Delete' ? 'text-red-700' : 'text-blue-600'} bg-gray-100 rounded-full px-3 py-2`}     
        />
    </div>
  )
}

export default IconComponent
