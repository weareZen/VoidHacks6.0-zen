'use client'
import Image from "next/image";
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from "@/components/Navbar";

export default function Home() {
  return (<ProtectedRoute>
    <div>
    <Navbar/>
      Hi
    </div></ProtectedRoute>
  );
}
