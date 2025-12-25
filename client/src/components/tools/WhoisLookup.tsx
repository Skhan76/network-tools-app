import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const whoisMutation = trpc.tools.whoisLookup.useMutation();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setSubmitted(true);
    await whoisMutation.mutateAsync({ domain: domain.trim() });
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle>WHOIS Lookup</CardTitle>
        <CardDescription>Look up domain registration and ownership information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Domain Name</label>
            <Input
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={whoisMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={whoisMutation.isPending || !domain.trim()}
          >
            {whoisMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Looking up...
              </>
            ) : (
              "Lookup Domain"
            )}
          </Button>
        </form>

        {whoisMutation.error && (
          <Alert className="border-red-700 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">
              {whoisMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {whoisMutation.data && (
          <div className="space-y-3 mt-6 pt-6 border-t border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              WHOIS Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {whoisMutation.data.registrar && (
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-slate-400">Registrar</p>
                  <p className="text-white font-medium">{whoisMutation.data.registrar}</p>
                </div>
              )}
              {whoisMutation.data.createdDate && (
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-slate-400">Created</p>
                  <p className="text-white font-medium">{whoisMutation.data.createdDate}</p>
                </div>
              )}
              {whoisMutation.data.expiryDate && (
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-slate-400">Expires</p>
                  <p className="text-white font-medium">{whoisMutation.data.expiryDate}</p>
                </div>
              )}
              {whoisMutation.data.updatedDate && (
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-slate-400">Updated</p>
                  <p className="text-white font-medium">{whoisMutation.data.updatedDate}</p>
                </div>
              )}
            </div>
            {whoisMutation.data.registrant && (
              <div className="bg-slate-700/50 p-4 rounded mt-4">
                <p className="text-slate-400 text-sm mb-2">Registrant</p>
                <p className="text-white">{whoisMutation.data.registrant}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
