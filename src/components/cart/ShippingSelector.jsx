import React from "react";

export default function ShippingSelector({ options, selected, onSelect }) {
  if (!options.length) {
    return <p className="text-muted-foreground text-sm">No shipping options available</p>;
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <label
          key={opt.id}
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
            selected?.id === opt.id
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div>
            <p className="font-medium">{opt.name}</p>
            <p className="text-xs text-muted-foreground">{opt.eta}</p>
          </div>

          <div className="font-bold">€{opt.cost}</div>

          <input
            type="radio"
            name="shipping"
            checked={selected?.id === opt.id}
            onChange={() => onSelect(opt)}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );
}
