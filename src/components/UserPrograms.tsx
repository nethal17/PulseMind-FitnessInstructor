import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  AppleIcon,
  ShieldIcon,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants";

const UserPrograms = () => {
  return (
    <section className="py-24 relative bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4">
              <span className="text-foreground">AI-Generated </span>
              <span className="text-primary">Programs</span>
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          </div>
          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
            Explore personalized fitness plans created by our <span className="text-primary font-semibold">AI assistant</span>
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-10 font-mono">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Programs</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-1">2min</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Creation</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Personalized</div>
            </div>
          </div>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USER_PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="bg-card backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 transition-all overflow-hidden relative group"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>

              {/* Card header with user info */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs font-mono text-primary">USER.{program.id.toString().padStart(3, '0')}</span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {program.fitness_level.toUpperCase()}
                </div>
              </div>

              <CardHeader className="pt-6 px-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
                      <img
                        src={program.profilePic}
                        alt={`${program.first_name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white font-mono mb-1">
                      {program.first_name}
                    </CardTitle>
                    <div className="text-sm text-gray-400 flex items-center gap-2 font-mono">
                      <Users className="h-3.5 w-3.5" />
                      {program.age}y • {program.workout_days}d/week
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="px-3 py-1.5 bg-primary/10 rounded border border-primary/30 text-sm text-primary flex items-center gap-2 font-mono">
                    <Sparkles className="h-3.5 w-3.5" />
                    {program.fitness_goal}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    v3.5
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5">
                {/* Program details */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary border border-primary/20 mt-0.5">
                      <Dumbbell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-background text-sm mb-1 font-mono">
                        {program.workout_plan.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {program.equipment_access}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary border border-primary/20 mt-0.5">
                      <AppleIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-background text-sm mb-1 font-mono">
                        {program.diet_plan.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Optimized nutrition protocol
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary border border-primary/20 mt-0.5">
                      <ShieldIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-background text-sm mb-1 font-mono">
                        Safety Protocols
                      </h3>
                      <p className="text-xs text-gray-400">
                        Injury prevention enabled
                      </p>
                    </div>
                  </div>
                </div>

                {/* Program description */}
                <div className="mt-5 pt-5 border-t border-primary/30">
                  <div className="text-xs text-gray-400 leading-relaxed font-mono">
                    <span className="text-primary">&gt;_ </span>
                    {program.workout_plan.description.substring(0, 100)}...
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-5 py-4 border-t border-primary/30 bg-primary/5">
                <Link href="/generate-program" className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm">
                    View Program
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <Link href="/generate-program">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground px-8 py-6 text-lg border-2 border-primary hover:bg-background hover:text-primary font-mono transition-all"
            >
              Generate Your Program
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-gray-400 mt-4 font-mono text-sm">
            Join <span className="text-primary font-bold">500+</span> users with AI-customized fitness programs
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserPrograms;