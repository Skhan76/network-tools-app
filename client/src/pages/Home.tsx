import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Network, Zap, Server, Search } from "lucide-react";
import WhoisLookup from "@/components/tools/WhoisLookup";
import DomainChecker from "@/components/tools/DomainChecker";
import SubnetCalculator from "@/components/tools/SubnetCalculator";
import BGPLookingGlass from "@/components/tools/BGPLookingGlass";
import UptimeChecker from "@/components/tools/UptimeChecker";

export default function Home() {
  const [activeTab, setActiveTab] = useState("whois");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Network Tools</h1>
                <p className="text-sm text-slate-400">Professional network utilities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Essential Network Tools</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              A comprehensive suite of utilities for network diagnostics, domain research, and connectivity monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 mb-8 bg-slate-800 p-1 rounded-lg">
              <TabsTrigger value="whois" className="flex items-center gap-2 text-xs sm:text-sm">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">WHOIS</span>
              </TabsTrigger>
              <TabsTrigger value="domain" className="flex items-center gap-2 text-xs sm:text-sm">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Domain</span>
              </TabsTrigger>
              <TabsTrigger value="subnet" className="flex items-center gap-2 text-xs sm:text-sm">
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Subnet</span>
              </TabsTrigger>
              <TabsTrigger value="bgp" className="flex items-center gap-2 text-xs sm:text-sm">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">BGP</span>
              </TabsTrigger>
              <TabsTrigger value="uptime" className="flex items-center gap-2 text-xs sm:text-sm">
                <Server className="w-4 h-4" />
                <span className="hidden sm:inline">Uptime</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="whois" className="space-y-4">
              <WhoisLookup />
            </TabsContent>

            <TabsContent value="domain" className="space-y-4">
              <DomainChecker />
            </TabsContent>

            <TabsContent value="subnet" className="space-y-4">
              <SubnetCalculator />
            </TabsContent>

            <TabsContent value="bgp" className="space-y-4">
              <BGPLookingGlass />
            </TabsContent>

            <TabsContent value="uptime" className="space-y-4">
              <UptimeChecker />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm">
            Network Tools © 2025. Built with precision for network professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}
