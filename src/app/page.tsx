import TerminalOverlay from "@/components/TerminalOverlay";
import UserPrograms from "@/components/UserPrograms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRightIcon, BrainCircuitIcon, DumbbellIcon, SparklesIcon, Zap, Shield, Target, TrendingUp, CheckCircle, Clock, Users } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative z-10 py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="absolute -top-4 left-[-35] w-40 h-40 border-l-2 border-t-2 border-primary" />
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Transform</span>
                </div>
                <div>
                  <span className="text-primary">Your Body</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>
              </h1>

              {/* SEPERATOR LINE */}
              <div className="h-px w-full bg-primary"></div>

              <p className="text-xl text-gray-500 w-2/3">
                Talk to our AI assistant and get personalized diet plans and workout routines
                designed just for you
              </p>

              {/* STATS */}
              <div className="flex items-center gap-10 py-6 font-mono">
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">500+</div>
                  <div className="text-xs uppercase tracking-wider">ACTIVE USERS</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">3min</div>
                  <div className="text-xs uppercase tracking-wider">GENERATION</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">100%</div>
                  <div className="text-xs uppercase tracking-wider">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium border border-primary hover:bg-background hover:text-primary"
                >
                  <Link href={"/generate-program"} className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
              {/* CORNER PIECES */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary" />
              </div>

              {/* IMAGE CONTANINER */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <img
                    src="/pulse-mind.jpg"
                    alt="AI Fitness Coach"
                    className="size-full object-cover object-center"
                  />

                  {/* SCAN LINE */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                  {/* DECORATIONS ON TOP THE IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />

                    {/* Targeting lines */}
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  </div>

      
              </div>

              <TerminalOverlay />
              
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* USER PROGRAMS SECTION */}
      <UserPrograms/>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16 relative">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4">
                <span className="text-foreground">How </span>
                <span className="text-primary">It Works</span>
              </h2>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            </div>
            <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
              Get your personalized fitness plan in <span className="text-primary font-semibold">3 simple steps</span>
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="bg-card backdrop-blur-sm border-2 border-primary/30 overflow-hidden relative group hover:border-primary/60 transition-all">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary font-mono">01</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent"></div>
                </div>
                
                <div className="mb-6 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BrainCircuitIcon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-background mb-3 font-mono">Voice Consultation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Talk to our AI assistant about your fitness goals, experience level, and preferences. Natural conversation, no forms to fill.
                </p>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="bg-card backdrop-blur-sm border-2 border-primary/30 overflow-hidden relative group hover:border-primary/60 transition-all">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary font-mono">02</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent"></div>
                </div>
                
                <div className="mb-6 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-background mb-3 font-mono">AI Generation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our advanced AI analyzes your profile and creates a customized workout and nutrition plan in under 2 minutes.
                </p>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="bg-card backdrop-blur-sm border-2 border-primary/30 overflow-hidden relative group hover:border-primary/60 transition-all">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary font-mono">03</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent"></div>
                </div>
                
                <div className="mb-6 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-background mb-3 font-mono">Start Training</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Access your plan instantly, track workouts, and watch your progress. Update anytime as you evolve.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 relative bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4">
              <span className="text-foreground">Why Choose </span>
              <span className="text-primary">PulseMind</span>
            </h2>
            <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
              Advanced AI technology meets personalized fitness coaching
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-card border border-primary/30 rounded-lg hover:border-primary/60 shadow-lg shadow-primary/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-mono">Lightning Fast</h3>
              <p className="text-sm text-gray-400">Get your complete plan in under 2 minutes with our optimized AI system</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-card border border-primary/30 rounded-lg hover:border-primary/60 transition-all group shadow-lg shadow-primary/40">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
                <Shield className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-mono">100% Personalized</h3>
              <p className="text-sm text-gray-400">Every plan is unique, tailored to your goals, experience, and lifestyle</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-card border border-primary/30 rounded-lg hover:border-primary/60 transition-all group shadow-lg shadow-primary/40">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
                <TrendingUp className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-mono">Track Progress</h3>
              <p className="text-sm text-gray-400">Log workouts, monitor improvements, and break personal records</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-card border border-primary/30 rounded-lg hover:border-primary/60 transition-all group shadow-lg shadow-primary/40">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
                <DumbbellIcon className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-mono">Adaptive Workouts</h3>
              <p className="text-sm text-gray-400">Plans that evolve with you, from beginner to advanced levels</p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-card border border-primary/30 rounded-lg hover:border-primary/60 transition-all group shadow-lg shadow-primary/40">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
                <Users className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-mono">Voice Powered</h3>
              <p className="text-sm text-gray-400">Natural conversation interface - just talk, no typing required</p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-card border border-primary/30 rounded-lg hover:border-primary/60 transition-all group shadow-lg shadow-primary/40">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
                <Clock className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-mono">24/7 Access</h3>
              <p className="text-sm text-gray-400">Your AI coach is always available, whenever you need guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4">
              <span className="text-foreground">What Users </span>
              <span className="text-primary">Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Card className="bg-card border-2 border-primary/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://randomuser.me/api/portraits/men/74.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-primary" />
                <div>
                  <p className="font-bold text-background">Peter Paul</p>
                  <p className="text-sm text-primary">Lost 15kg in 3 months</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                &ldquo;The AI understood exactly what I needed. The plan was perfect for my busy schedule and the results speak for themselves!&rdquo;
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle key={i} className="w-4 h-4 text-primary" />
                ))}
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-card border-2 border-primary/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://media.gettyimages.com/id/2159296610/photo/happy-female-athlete-on-sports-training-in-a-gym.jpg?s=612x612&w=gi&k=20&c=Bq2uWXFZbtVRh7oYEm2Q0mIpTSVSC6NEex48f5olVbk=" alt="User" className="w-12 h-12 rounded-full border-2 border-primary" />
                <div>
                  <p className="font-bold text-background">Sarah Chen</p>
                  <p className="text-sm text-primary">Gained 8kg muscle</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                &ldquo;Best investment in my fitness journey. The voice interface makes it so easy to get started, and the workouts are challenging!&rdquo;
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle key={i} className="w-4 h-4 text-primary" />
                ))}
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-card border-2 border-primary/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-primary" />
                <div>
                  <p className="font-bold text-background">John Davis</p>
                  <p className="text-sm text-primary">Marathon ready in 6 months</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                &ldquo;From couch to marathon! The progressive plan kept me motivated and injury-free. This AI knows what it&apos;s doing!&rdquo;
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle key={i} className="w-4 h-4 text-primary" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Card className="bg-card backdrop-blur-sm border-2 border-primary/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary"></div>
            
            <div className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold font-mono mb-6">
                <span className="text-background">Ready to </span>
                <span className="text-primary">Transform?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join 500+ users who&apos;ve already started their fitness journey with AI-powered personalization
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary text-primary-foreground px-8 py-6 text-lg font-medium border-2 border-primary hover:bg-background hover:text-primary transition-all"
                >
                  <Link href="/generate-program" className="flex items-center font-mono">
                    Start Your Journey
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Takes less than 2 minutes</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-300">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-300">Instant access</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;