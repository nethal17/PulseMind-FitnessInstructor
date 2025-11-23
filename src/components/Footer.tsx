import { ZapIcon, Github, Twitter, Linkedin, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative border-t border-primary/30 bg-background backdrop-blur-sm mt-auto">
      {/* Top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/20 rounded-lg border border-primary/30 group-hover:bg-primary/30 transition-all">
                <ZapIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold font-mono">
                pulse<span className="text-primary">mind</span>.ai
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Transform your fitness journey with AI-powered personalization. Get custom workout and nutrition plans in under 2 minutes.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all group">
                <Twitter className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all group">
                <Github className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all group">
                <Linkedin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="text-primary">&gt;_</span> Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/generate-program" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>Generate Program</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/workout-tracking" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>Track Workouts</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>My Profile</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>Features</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="text-primary">&gt;_</span> Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>About Us</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>Blog</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>Contact</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span>Help Center</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="text-primary">&gt;_</span> Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href="mailto:support@pulsemind.ai" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    support@pulsemind.ai
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href="tel:+94760391736" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    +94 76 039 1736
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm text-gray-400">
                    Malabe, Sri Lanka
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-gray-400 font-mono">
              © {new Date().getFullYear()} <span className="text-primary">pulsemind.ai</span> - All rights reserved
            </p>
            <div className="hidden md:block w-px h-4 bg-primary/30"></div>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="text-primary/30">•</span>
              <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="text-primary/30">•</span>
              <Link href="/cookies" className="text-gray-400 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-primary">AI SYSTEM ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-primary/20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary/20 pointer-events-none"></div>
    </footer>
  );
};
export default Footer;