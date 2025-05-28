import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, Github, Calendar, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
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
      <Input
        startIcon={<Search className="h-4 w-4" />}
        endIcon={<Calendar className="h-4 w-4" />}
        placeholder="Search dates"
      />
      <Textarea placeholder="Enter your message" />
    </div>
  );
}
