import Link from 'next/link'
export default async function Page() {
 
  return (
    <div>
        <button className='rounded-full border border-solid'><Link href={'/play/2048'}>Play 2048</Link></button>
    </div>
  )
}