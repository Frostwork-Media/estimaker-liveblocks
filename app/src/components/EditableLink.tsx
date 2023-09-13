import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export function EditableLink({
  title,
  description,
  placeholder,
  currentValue,
  save,
  clear,
}: {
  title: string;
  description: string;
  placeholder: string;
  currentValue?: string;
  save: (value: string) => void;
  clear: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-2">
      <label htmlFor="manifold">
        <h2 className="font-medium text-neutral-900">{title}</h2>
        <p className="text-slate-500 text-sm">{description}</p>
      </label>
      <div className="flex gap-2">
        <Input
          id="manifold"
          placeholder={placeholder}
          className="flex-1"
          {...(currentValue
            ? { value: currentValue, readOnly: true }
            : {
                value,
                onChange: (e) => {
                  setValue(e.target.value);
                },
              })}
        />
        {currentValue ? (
          <Button onClick={clear} variant="destructive">
            Clear
          </Button>
        ) : (
          <Button onClick={() => save(value)}>Link</Button>
        )}
      </div>
    </div>
  );
}
