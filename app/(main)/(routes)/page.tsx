import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <p className='text-3xl font-bold text-gray-500'>Discord Clone</p>
      <UserButton afterSignOutUrl="/"></UserButton>
    </div>
  )
}
