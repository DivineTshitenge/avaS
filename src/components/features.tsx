import { MonitorSmartphone, Shield, Sparkles, Tv } from "lucide-react";
import { Reveal } from "@/components/reveal";

const pillars = [
  {
    icon: Sparkles,
    title: "Un divertissement sans fin",
    text: "Des séries, des films et des productions originales, réunis au même endroit.",
  },
  {
    icon: Tv,
    title: "Vos appareils préférés",
    text: "Jusqu'à 4 écrans compatibles en simultané : télévision, ordinateur, mobile et tablette.",
  },
  {
    icon: Shield,
    title: "Un contrôle parental intuitif",
    text: "Des profils verrouillables par mot de passe pour protéger la famille.",
  },
  {
    icon: MonitorSmartphone,
    title: "Dès 5 $US / mois",
    text: "Films, séries, podcasts et originaux. Sans engagement, annulable à tout moment.",
  },
];

export function Features() {
  return (
    <section className="bg-cream px-4 pb-8 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 border-t border-black/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.05}>
            <item.icon className="h-5 w-5" strokeWidth={1.25} />
            <h3 className="font-display mt-4 text-2xl font-normal">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
