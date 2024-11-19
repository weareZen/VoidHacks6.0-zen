'use client'

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/svvv.png" 
              alt="System Logo" 
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Log in to manage your internship journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input 
                id="email"
                type="text"
                placeholder="Enter your email or username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember Me</Label>
              </div>
              <Button variant="link" className="text-sm p-0">
                Forgot Password?
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-zinc-500">
          <div className="flex items-center justify-center space-x-1">
            <span>Need help?</span>
            <Button variant="link" className="p-0">Contact Support</Button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button variant="link" className="p-0">Privacy Policy</Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="link" className="p-0">Terms of Use</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;