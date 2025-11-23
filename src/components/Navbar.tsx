"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon, MenuIcon, XIcon, ActivityIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const Navbar = () => {
    const { isSignedIn } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleProtectedNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!isSignedIn) {
            e.preventDefault();
            // Trigger the sign-in modal by clicking the hidden sign-in button
            const signInButton = document.getElementById('hidden-signin-trigger');
            signInButton?.click();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-100 backdrop-blur-md border-b border-primary py-3 shadow-md">
            <div className="container flex items-center justify-between mx-auto px-4">
                {/* Hidden sign-in button for triggering modal */}
                <SignInButton mode="modal">
                    <button id="hidden-signin-trigger" className="hidden" aria-hidden="true" />
                </SignInButton>
                
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href="/" className="flex items-center gap-2">
                    <div className="p-2 bg-primary/20 rounded-lg border border-primary/30 group-hover:bg-primary/30">
                        <ZapIcon className="w-6 h-6 text-primary" />
                    </div>
                        <span className="text-xl font-bold font-mono">
                            pulse<span className="text-primary">mind</span>.ai
                        </span>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono"
                    >
                        <HomeIcon size={22} />
                        <span>Home</span>
                    </Link>

                    <Link
                        href="/generate-program"
                        onClick={(e) => handleProtectedNavigation(e, '/generate-program')}
                        className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono"
                    >
                        <DumbbellIcon size={22} />
                        <span>Generate</span>
                    </Link>

                    <Link
                        href="/workout-tracking"
                        onClick={(e) => handleProtectedNavigation(e, '/workout-tracking')}
                        className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono"
                    >
                        <ActivityIcon size={22} />
                        <span>Track</span>
                    </Link>

                    <Link
                        href="/profile"
                        onClick={(e) => handleProtectedNavigation(e, '/profile')}
                        className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono"
                    >
                        <UserIcon size={22} />
                        <span>Profile</span>
                    </Link>
                </div>

                {/* Desktop Auth Buttons */}
                <nav className="hidden md:flex items-center gap-6">
                    {isSignedIn ? (
                        <>
                            <Button
                                asChild
                                variant="outline"
                                className="ml-2 border-primary hover:text-primary text-white bg-primary hover:bg-white"
                            >
                                <Link href="/generate-program">Get Started</Link>
                            </Button>
                            
                            <UserButton/>
                        </>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <Button
                                    variant={"outline"}
                                    className="border border-primary bg-gray-100 text-primary hover:bg-white hover:text-primary"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>

                            <SignUpButton mode="modal">
                                <Button 
                                    variant={"outline"}
                                    className="border border-primary bg-primary text-white hover:bg-blue-500 hover:text-white">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </>
                    )}
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-gray-100 backdrop-blur-md border-t border-primary py-4 px-6 space-y-4">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <HomeIcon size={22} />
                                <span>Home</span>
                            </Link>

                            <Link
                                href="/generate-program"
                                className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono py-2"
                                onClick={(e) => {
                                    setMobileMenuOpen(false);
                                    handleProtectedNavigation(e, '/generate-program');
                                }}
                            >
                                <DumbbellIcon size={22} />
                                <span>Generate</span>
                            </Link>

                            <Link
                                href="/workout-tracking"
                                className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono py-2"
                                onClick={(e) => {
                                    setMobileMenuOpen(false);
                                    handleProtectedNavigation(e, '/workout-tracking');
                                }}
                            >
                                <ActivityIcon size={22} />
                                <span>Track Workouts</span>
                            </Link>

                            <Link
                                href="/profile"
                                className="flex items-center gap-1.5 text-md hover:text-primary transition-colors font-mono py-2"
                                onClick={(e) => {
                                    setMobileMenuOpen(false);
                                    handleProtectedNavigation(e, '/profile');
                                }}
                            >
                                <UserIcon size={22} />
                                <span>Profile</span>
                            </Link>
                        </div>

                        <div className="flex flex-col space-y-3 pt-4 border-t border-primary/50">
                            {isSignedIn ? (
                                <>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-primary hover:text-primary text-white bg-primary hover:bg-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link href="/generate-program">Get Started</Link>
                                    </Button>
                                    <div className="flex justify-center">
                                        <UserButton />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <SignInButton mode="modal">
                                        <Button

                                            variant={"outline"}
                                            className="w-full border border-primary text-primary hover:text-white hover:bg-primary"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Button>
                                    </SignInButton>

                                    <SignUpButton mode="modal">
                                        <Button 
                                            className="w-full bg-primary text-white hover:bg-background hover:text-primary border border-primary"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Button>
                                    </SignUpButton>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
};

export default Navbar;