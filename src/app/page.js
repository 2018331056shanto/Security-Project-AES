"use client"
import Image from 'next/image'
// import AES from './Aes/aes'
import AESEncryption from './Aes/AesEnrcyption'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <AES/> */}
      <AESEncryption/>
    </main>
  )
}
