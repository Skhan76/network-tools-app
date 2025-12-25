import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";

export default function DomainChecker() {
  const [domain, setDomain] = useState("");

  const registrars = [
    { name: "GoDaddy", url: "https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=" },
    { name: "Namecheap", url: "https://www.namecheap.com/domains/registration/results/?domain=" },
  ];

  const handleSearch = (registrar: { name: string; url: string }) => {
    if (!domain.trim()) return;
    window.open(registrar.url + encodeURIComponent(domain.trim()), "_blank");
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle>Domain Availability Checker</CardTitle>
        <CardDescription>Check domain availability and register through popular registrars</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200">Domain Name</label>
          <Input
            type="text"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {registrars.map((registrar) => (
            <Button
              key={registrar.name}
              onClick={() => handleSearch(registrar)}
              disabled={!domain.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2"
            >
              Check on {registrar.name}
              <ExternalLink className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <div className="bg-slate-700/50 p-4 rounded text-sm text-slate-300">
          <p className="font-medium text-white mb-2">How it works:</p>
          <p>Click on a registrar above to check domain availability and pricing. You will be redirected to their website where you can complete the purchase if the domain is available.</p>
        </div>
      </CardContent>
    </Card>
  );
}
