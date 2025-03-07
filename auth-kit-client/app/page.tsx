"use client";
import { userContext } from "@/context/userContext.js"


export default function Home() {
  
  const user = userContext();
  console.log(user);
  return (
    <main></main>
  );
}
