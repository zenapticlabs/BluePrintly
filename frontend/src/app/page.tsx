import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex gap-4">
      {/* Email Button with start icon */}
      <Button startIcon={<Mail />}>
        Send Email
      </Button>

      {/* Action Button with end icon */}
      <Button variant="secondary" endIcon={<ArrowRight />}>
        Continue
      </Button>

      {/* Button with both icons */}
      <Button variant="outline" startIcon={<Github />} endIcon={<ArrowRight />}>
        Login with Github
      </Button>

      
    </div>
  );
}
