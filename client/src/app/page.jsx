'use client'
import Image from "next/image";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (<ProtectedRoute>
    <div>
      Hi
    </div></ProtectedRoute>
  );
}
