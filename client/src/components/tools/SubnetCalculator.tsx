import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  usableHosts: number;
  subnetMask: string;
  cidr: number;
}

function calculateSubnet(cidr: string): SubnetResult | null {
  try {
    const [ip, prefix] = cidr.split("/");
    if (!ip || !prefix) return null;

    const prefixNum = parseInt(prefix);
    if (prefixNum < 0 || prefixNum > 32) return null;

    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => p < 0 || p > 255)) return null;

    const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
    const mask = prefixNum === 0 ? 0 : (0xffffffff << (32 - prefixNum)) >>> 0;
    const network = ipNum & mask;
    const broadcast = network | (~mask >>> 0);

    const numHosts = Math.pow(2, 32 - prefixNum);
    const usableHosts = Math.max(0, numHosts - 2);

    const toIp = (num: number) => {
      return [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff].join(".");
    };

    const maskBits = mask.toString(2).padStart(32, "0");
    const maskParts = [
      parseInt(maskBits.substring(0, 8), 2),
      parseInt(maskBits.substring(8, 16), 2),
      parseInt(maskBits.substring(16, 24), 2),
      parseInt(maskBits.substring(24, 32), 2),
    ];

    return {
      networkAddress: toIp(network),
      broadcastAddress: toIp(broadcast),
      firstUsable: usableHosts > 0 ? toIp(network + 1) : toIp(network),
      lastUsable: usableHosts > 0 ? toIp(broadcast - 1) : toIp(broadcast),
      usableHosts: Math.max(0, usableHosts),
      subnetMask: maskParts.join("."),
      cidr: prefixNum,
    };
  } catch {
    return null;
  }
}

export default function SubnetCalculator() {
  const [cidr, setCidr] = useState("");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!cidr.trim()) {
      setError("Please enter a CIDR notation (e.g., 192.168.1.0/24)");
      return;
    }

    const calculated = calculateSubnet(cidr.trim());
    if (!calculated) {
      setError("Invalid CIDR notation. Please use format: IP/PREFIX (e.g., 192.168.1.0/24)");
      return;
    }

    setResult(calculated);
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle>IPv4 Subnet Calculator</CardTitle>
        <CardDescription>Calculate subnet information from CIDR notation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">CIDR Notation</label>
            <Input
              type="text"
              placeholder="192.168.1.0/24"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calculate
          </Button>
        </form>

        {error && (
          <Alert className="border-red-700 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-3 mt-6 pt-6 border-t border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Subnet Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">Network Address</p>
                <p className="text-white font-medium font-mono">{result.networkAddress}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">Broadcast Address</p>
                <p className="text-white font-medium font-mono">{result.broadcastAddress}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">Subnet Mask</p>
                <p className="text-white font-medium font-mono">{result.subnetMask}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">CIDR</p>
                <p className="text-white font-medium font-mono">/{result.cidr}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">First Usable Host</p>
                <p className="text-white font-medium font-mono">{result.firstUsable}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-400">Last Usable Host</p>
                <p className="text-white font-medium font-mono">{result.lastUsable}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded sm:col-span-2">
                <p className="text-slate-400">Total Usable Hosts</p>
                <p className="text-white font-medium">{result.usableHosts.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
