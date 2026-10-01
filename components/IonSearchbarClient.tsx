'use client';

import React from 'react';
import { Input, type InputProps, type InputRef } from 'antd';

interface IonSearchbarClientProps extends Omit<InputProps, 'type' | 'ref' | 'suffix' | 'prefix'> {
  value?: string;
  onIonInput?: (e: { detail: { value: string | number | null } }) => void;
  placeholder?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
}

const IonSearchbarClient = React.forwardRef<InputRef, IonSearchbarClientProps>(
  ({ value, onIonInput, placeholder, className, style, ...rest }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onIonInput?.({ detail: { value: e.target.value } });
    };

    return (
      <Input.Search
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        enterButton
        className={className}
        style={style}
        {...rest}
      />
    );
  }
);

IonSearchbarClient.displayName = 'IonSearchbarClient';

export default IonSearchbarClient;