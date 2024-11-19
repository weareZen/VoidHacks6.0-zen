import React from 'react';

export function LoadingSpinner({ className }) {
  return (
    <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-primary ${className}`} />
  );
}

export function LoadingCard({ className }) {
  return (
    <div className={`p-4 rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner Skeleton */}
      <LoadingCard className="bg-primary/5" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingCard className="lg:col-span-2" />
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
} 