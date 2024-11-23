import React from 'react'

const Footer = () => {
    const d = new Date();
  return (
    <section className='c-space pt-7 pb-7 border-t border-black-300 flex justify-between items-center flex-wrap'>
        <div className='text-white-500 flex gap-2'>
            <p>{d.getFullYear()} Sahiljeet. All right reserved</p>
        </div>
        <div className='flex gap-3'>
            <div className='social-icon'>
                <a href="https://github.com/ghostofweb" target="_blank" rel="noreferrer" className='w-1/2 h-1/2'
                ><img src="/assets/github.svg" alt="" />
                </a>
            </div>
            <div className='social-icon'>
                <a href="https://www.linkedin.com/in/sahiljeet-singh-kalsi-085844244/" target="_blank" rel="noreferrer" className='w-1/2 h-1/2'
                ><img src="/assets/linkedin.svg" alt="" />
                </a>
            </div>
        </div>
    </section>
  )
}

export default Footer