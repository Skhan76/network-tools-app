import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function UptimeChecker() {
  const [url, setUrl] = useState("");
  const uptimeMutation = trpc.tools.checkUptime.useMutation();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await uptimeMutation.mutateAsync({ url: url.trim() });
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 300 && status < 400) return "text-blue-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusLabel = (status: number) => {
    if (status >= 200 && status < 300) return "OK";
    if (status >= 300 && status < 400) return "Redirect";
    if (status >= 400 && status < 500) return "Client Error";
    return "Server Error";
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle>Website Uptime Checker</CardTitle>
        <CardDescription>Check website status, response time, and HTTP status code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Website URL</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={uptimeMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={uptimeMutation.isPending || !url.trim()}
          >
            {uptimeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Status"
            )}
          </Button>
        </form>

        {uptimeMutation.error && (
          <Alert className="border-red-700 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">
              {uptimeMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {uptimeMutation.data && (
          <div className="space-y-3 mt-6 pt-6 border-t border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Status Check Results
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">HTTP Status</p>
                <p className={`font-medium font-mono text-lg ${getStatusColor(uptimeMutation.data.statusCode)}`}>
                  {uptimeMutation.data.statusCode}
                </p>
                <p className="text-slate-400 text-xs mt-1">{getStatusLabel(uptimeMutation.data.statusCode)}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">Response Time</p>
                <p className="text-white font-medium font-mono text-lg">{uptimeMutation.data.responseTime}ms</p>
              </div>
              {uptimeMutation.data.contentLength && (
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-slate-400">Content Length</p>
                  <p className="text-white font-medium font-mono">{(uptimeMutation.data.contentLength / 1024).toFixed(2)} KB</p>
                </div>
              )}
              {uptimeMutation.data.contentType && (
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-slate-400">Content Type</p>
                  <p className="text-white font-medium font-mono text-sm">{uptimeMutation.data.contentType}</p>
                </div>
              )}
            </div>
            {uptimeMutation.data.isOnline ? (
              <div className="bg-green-900/20 border border-green-700 p-3 rounded text-green-400 text-sm">
                Website is online and responding normally.
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-700 p-3 rounded text-red-400 text-sm">
                Website is offline or not responding.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
