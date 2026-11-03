import type { ReactNode } from "react";


interface EventFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  helperText?: string;
  errorMessage?: string;
}


export default function EventFormField({
  id,
  label,
  children,
  helperText,
  errorMessage,
}: EventFormFieldProps) {

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-light-100" htmlFor={id}>
        { label }
      </label>

      { children }

      {
        helperText && (
          <p className="text-xs leading-relaxed text-light-200">
            { helperText }
          </p>
        )
      }
      
      {
        errorMessage && (
          <p className="text-xs leading-relaxed text-red-300" role="alert">
            { errorMessage }
          </p>
        )
      }
    </div>
  );
}