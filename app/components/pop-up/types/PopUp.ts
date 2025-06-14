import React from "react";

export type Option = {
  label: string;
  value: string | number;
};

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'hidden' | 'file' | 'select';
  required?: boolean;
  options?: Option[];
  fetchOptions?: () => Promise<Option[]>;
};


export interface FormPopupProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  endPoint: any;
  method: string;
  fields: Field[];
  defaultValues?: Record<string, unknown>;
}

export type OptionType = {
  value: string | number;
  label: string;
};

