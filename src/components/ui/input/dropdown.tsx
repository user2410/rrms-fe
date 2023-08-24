import clsx from "clsx";
import React, { useState } from "react";
import { Control, FieldErrors, FieldValues, RegisterOptions, UseFormGetValues, UseFormRegister, UseFormSetValue, useWatch } from "react-hook-form";

interface Value {
  label: string;
  value: string;
}

interface DropdownInputProps {
  id: string;
  label: string;
  values: Value[];
  control: Control<FieldValues, any>;
  setValue: UseFormSetValue<FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  registerOption?: RegisterOptions<FieldValues, string>;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  id,
  label,
  control,
  values,
  setValue,
  register,
  errors,
  registerOption
}) => {
  const [showProTypeDropdown, setShowProTypeDropdown] = useState<boolean>(false);
  const selection = useWatch({
    control,
    name: id,
    defaultValue: label,
  });

  return (
    <div className="relative w-full">
      <input
        id={id}
        type="hidden"
        {...register(id, registerOption)}
      />
      <button
        className="w-full border border-slate-300 hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-between items-center"
        type="button"
        onClick={() => setShowProTypeDropdown(!showProTypeDropdown)}>
        <span>{(() =>{
          const i = values.find(item => item.value === selection);
          return i ? i.label : label;
        })()}</span>
        <svg className="w-2.5 h-2.5 ml-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {errors[id] && (
        <p className="mt-1 text-xs text-rose-600">
          {errors[id]?.message?.toString()}
        </p>
      )}
      <div className={clsx(
        "z-20 absolute top-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700",
        showProTypeDropdown ? "block" : "hidden"
      )}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          {
            values.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    setValue(id, item.value);
                    setShowProTypeDropdown(false);
                  }}>
                    {item.label}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
};

export default DropdownInput;