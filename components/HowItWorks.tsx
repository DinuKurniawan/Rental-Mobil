import { Search, CalendarDays, Key, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Select",
    description: "Browse our curated fleet and pick your perfect drive."
  },
  {
    icon: CalendarDays,
    title: "Schedule",
    description: "Define your pick-up point and journey duration."
  },
  {
    icon: CreditCard,
    title: "Secure",
    description: "Fast and encrypted payments for peace of mind."
  },
  {
    icon: Key,
    title: "Drive",
    description: "Ready at your doorstep or our prime locations."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-xl space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Seamless <span className="text-muted-foreground/30">Process</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Four simple steps to absolute freedom on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-start group space-y-6">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 border-b border-border/50 pb-2 w-full flex justify-between items-center">
                <span>Phase 0{index + 1}</span>
                <step.icon className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black uppercase tracking-tighter">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
