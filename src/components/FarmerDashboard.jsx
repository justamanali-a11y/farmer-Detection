"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Activity,
  ScanSearch,
  Sprout,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import DashboardChart from "./DashboardChart";

export default function FarmerDashboard({ onBack }) {
  const [filter, setFilter] = useState("all");

  const scansHistory = [
    {
      id: "SCAN-1092",
      crop: "Tomato",
      disease: "Early Blight",
      status: "action_needed",
      confidence: 94,
      date: "2026-03-12",
      severity: "Moderate",
    },
    {
      id: "SCAN-1091",
      crop: "Wheat",
      disease: "Healthy",
      status: "healthy",
      confidence: 98,
      date: "2026-03-10",
      severity: "None",
    },
    {
      id: "SCAN-1090",
      crop: "Chilli",
      disease: "Leaf Curl Virus",
      status: "critical",
      confidence: 89,
      date: "2026-03-08",
      severity: "Severe",
    },
    {
      id: "SCAN-1089",
      crop: "Rice",
      disease: "Bacterial Blight",
      status: "action_needed",
      confidence: 91,
      date: "2026-03-05",
      severity: "Moderate",
    },
  ];

  const filteredScans = scansHistory.filter((item) => {
    if (filter === "healthy") return item.status === "healthy";
    if (filter === "issues") return item.status !== "healthy";
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8 text-stone-800">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            Real-time Insights
          </Badge>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900">
            Analytics & Reports Dashboard
          </h1>
          <p className="mt-1 text-stone-500">
            Detailed performance tracking and disease inspection summary.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <ScanSearch className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">Total Scans</p>
                <h3 className="text-2xl font-bold text-stone-900">128</h3>
                <p className="text-xs text-emerald-600 font-medium">↑ 12% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">Healthy Crops</p>
                <h3 className="text-2xl font-bold text-stone-900">91</h3>
                <p className="text-xs text-stone-400">71% health rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">Diseases Found</p>
                <h3 className="text-2xl font-bold text-stone-900">37</h3>
                <p className="text-xs text-rose-500 font-medium">Requires action</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">AI Accuracy</p>
                <h3 className="text-2xl font-bold text-stone-900">94.8%</h3>
                <p className="text-xs text-stone-400">High confidence</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Health Trend Analysis</CardTitle>
                <p className="text-xs text-stone-500">Scan results breakdown over time</p>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <DashboardChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crop Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Early Blight Action
                </div>
                <p className="mt-1 text-xs text-amber-800">
                  Apply copper-based fungicide to affected tomato crops within 48 hours.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Wheat Conditions
                </div>
                <p className="mt-1 text-xs text-emerald-800">
                  Ideal growth conditions detected. Maintain regular irrigation schedule.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan History Table */}
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Detailed Scan History</CardTitle>
              <p className="text-xs text-stone-500">Complete list of previous diagnostics</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filter === "healthy" ? "default" : "outline"}
                onClick={() => setFilter("healthy")}
              >
                Healthy
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filter === "issues" ? "default" : "outline"}
                onClick={() => setFilter("issues")}
              >
                Issues
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-stone-50 text-xs text-stone-500 uppercase">
                  <tr>
                    <th className="p-3">Scan ID</th>
                    <th className="p-3">Crop</th>
                    <th className="p-3">Detected Result</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-semibold text-stone-800">{scan.id}</td>
                      <td className="p-3">{scan.crop}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            scan.status === "healthy"
                              ? "text-emerald-600"
                              : scan.status === "critical"
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {scan.status === "healthy" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          )}
                          {scan.disease}
                        </span>
                      </td>
                      <td className="p-3">{scan.confidence}%</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            scan.severity === "Severe"
                              ? "destructive"
                              : scan.severity === "Moderate"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {scan.severity}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-stone-500">{scan.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}