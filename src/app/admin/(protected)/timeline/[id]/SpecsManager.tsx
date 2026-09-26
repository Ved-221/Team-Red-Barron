"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { updateSpecs } from "../actions";

interface Spec {
  id?: string;
  label: string;
  value: string;
  sort_order: number;
}

export default function SpecsManager({ vehicleId, initialSpecs }: { vehicleId: string, initialSpecs: Spec[] }) {
  const [specs, setSpecs] = useState<Spec[]>(initialSpecs);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setSpecs([...specs, { label: "", value: "", sort_order: specs.length }]);
  };

  const handleRemove = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    // update sort_order
    newSpecs.forEach((s, i) => s.sort_order = i);
    setSpecs(newSpecs);
  };

  const handleChange = (index: number, field: keyof Spec, value: string | number) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateSpecs(vehicleId, specs);
    setIsSaving(false);
    alert("Specs saved successfully");
  };

  return (
    <div className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b] mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-xl text-white">Vehicle Specs</h2>
          <p className="text-[#ae8882] text-xs mt-1">Manage specifications displayed on the vehicle spotlight and timeline.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-sora font-bold text-xs uppercase transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Spec
        </button>
      </div>

      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-4 bg-black/30 p-3 rounded-lg border border-white/5">
            <GripVertical className="w-5 h-5 text-white/20 cursor-grab active:cursor-grabbing shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => handleChange(index, "label", e.target.value)}
                placeholder="Label (e.g. CURB WEIGHT)"
                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                placeholder="Value (e.g. 191 KG)"
                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="p-2 text-white/40 hover:text-red-500 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {specs.length === 0 && (
          <div className="text-center py-8 text-white/40 text-sm">
            No specs added yet.
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white hover:bg-gray-200 text-black font-sora font-bold text-sm uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Specs"}
        </button>
      </div>
    </div>
  );
}
