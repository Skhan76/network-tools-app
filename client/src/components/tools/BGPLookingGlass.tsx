import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BGPLookingGlass() {
  const [query, setQuery] = useState("");
  const bgpMutation = trpc.tools.bgpLookup.useMutation();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await bgpMutation.mutateAsync({ query: query.trim() });
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle>BGP Looking Glass</CardTitle>
        <CardDescription>Query routing information by CIDR prefix or ASN</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">CIDR or ASN</label>
            <Input
              type="text"
              placeholder="192.0.2.0/24 or AS65000"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={bgpMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={bgpMutation.isPending || !query.trim()}
          >
            {bgpMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Querying...
              </>
            ) : (
              "Query BGP"
            )}
          </Button>
        </form>

        {bgpMutation.error && (
          <Alert className="border-red-700 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">
              {bgpMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {bgpMutation.data && bgpMutation.data.length > 0 && (
          <div className="space-y-3 mt-6 pt-6 border-t border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              BGP Routes ({bgpMutation.data.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bgpMutation.data.map((route: any, idx: number) => (
                <div key={idx} className="bg-slate-700/50 p-3 rounded text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-medium font-mono">{route.cidr}</p>
                    <p className="text-cyan-400 font-mono">AS{route.asn}</p>
                  </div>
                  {route.hits && <p className="text-slate-400 text-xs">Visibility: {route.hits} hits</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {bgpMutation.data && bgpMutation.data.length === 0 && (
          <Alert className="border-yellow-700 bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-400">
              No routes found for the given query.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
