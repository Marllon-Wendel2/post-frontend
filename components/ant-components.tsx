'use client';

import React from 'react';
import { Button, Input, Modal, Typography, Space, Spin, type ButtonProps, type InputProps, type ModalProps, type InputRef } from 'antd';

const { Text } = Typography;

interface IonButtonProps extends Omit<ButtonProps, 'onClick' | 'type' | 'danger' | 'variant' | 'color' | 'size'> {
  expand?: 'block' | 'full';
  fill?: 'solid' | 'outline' | 'clear';
  shape?: 'round';
  size?: 'default' | 'small' | 'large';
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'medium' | 'light' | 'dark';
  strong?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export const IonButton = React.forwardRef<HTMLButtonElement, IonButtonProps>(
  ({ expand, fill, shape, size, color, strong, className, children, disabled, onClick, ...rest }, ref) => {
    const antdSize = size === 'default' ? 'middle' : size;
    
    let antdType: ButtonProps['type'] = 'default';
    let antdDanger = false;
    let antdVariant: ButtonProps['variant'] = 'filled';
    
    if (fill === 'outline') {
      antdVariant = 'outlined';
    } else if (fill === 'clear') {
      antdVariant = 'text';
    }
    
    if (color === 'success') {
      antdType = 'primary';
    } else if (color === 'danger') {
      antdType = 'default';
      antdDanger = true;
    } else if (color === 'warning') {
      antdType = 'default';
    } else if (color === 'medium' || color === 'light' || color === 'dark') {
      antdType = 'default';
    }
    
    const classNames = [
      className,
      expand === 'block' && 'ant-btn-block',
      shape === 'round' && 'ant-btn-round',
      strong && 'ant-btn-strong',
    ].filter(Boolean).join(' ');
    
    const style: React.CSSProperties = {
      ...(rest.style as React.CSSProperties),
    };
    
    return (
      <Button
        ref={ref}
        type={antdType}
        danger={antdDanger}
        variant={antdVariant}
        size={antdSize}
        disabled={disabled}
        className={classNames}
        style={style}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

IonButton.displayName = 'IonButton';

interface IonItemProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const IonItem = ({ children, className, onClick, ...rest }: IonItemProps) => {
  return (
    <div
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

interface IonLabelProps {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  position?: 'fixed' | 'stacked' | 'floating';
}

export const IonLabel = ({ children, className, color, ...rest }: IonLabelProps) => {
  const style: React.CSSProperties = color ? { color } : {};
  
  return (
    <Text className={className} style={style} {...rest}>
      {children}
    </Text>
  );
};

interface IonTextProps {
  children?: React.ReactNode;
  className?: string;
  color?: string;
}

export const IonText = ({ children, className, color, ...rest }: IonTextProps) => {
  const style: React.CSSProperties = color ? { color } : {};
  
  return (
    <Text className={className} style={style} {...rest}>
      {children}
    </Text>
  );
};

interface IonButtonsProps {
  slot?: 'start' | 'end' | 'primary' | 'secondary';
  children?: React.ReactNode;
  className?: string;
}

export const IonButtons = ({ children, className, ...rest }: IonButtonsProps) => {
  return (
    <Space className={className} {...rest}>
      {children}
    </Space>
  );
};

interface IonContentProps {
  children?: React.ReactNode;
  className?: string;
  fullscreen?: boolean;
  scrollEvents?: boolean;
  scrollY?: boolean;
  forceOverscroll?: boolean;
}

export const IonContent = ({ children, className, ...rest }: IonContentProps) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

interface IonHeaderProps {
  children?: React.ReactNode;
  className?: string;
  translucent?: boolean;
}

export const IonHeader = ({ children, className, ...rest }: IonHeaderProps) => {
  return (
    <header className={className} {...rest}>
      {children}
    </header>
  );
};

interface IonToolbarProps {
  children?: React.ReactNode;
  className?: string;
  color?: string;
}

export const IonToolbar = ({ children, className, color, ...rest }: IonToolbarProps) => {
  const style: React.CSSProperties = color ? { backgroundColor: color } : {};
  
  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  );
};

interface IonTitleProps {
  children?: React.ReactNode;
  className?: string;
  size?: 'large' | 'small';
}

export const IonTitle = ({ children, className, ...rest }: IonTitleProps) => {
  return (
    <Typography.Title level={5} className={className} {...rest}>
      {children}
    </Typography.Title>
  );
};

interface IonListProps {
  children?: React.ReactNode;
  className?: string;
  lines?: 'full' | 'inset' | 'none';
  [key: string]: unknown;
}

export const IonList = ({ children, className, lines, ...rest }: IonListProps) => {
  const bordered = lines !== 'none';
  const classNames = [className, 'np-list', bordered && 'np-list-bordered']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
};

interface IonModalProps extends ModalProps {
  isOpen: boolean;
  className?: string;
  onDidDismiss?: () => void;
}

export const IonModal = ({ isOpen, className, onDidDismiss, ...rest }: IonModalProps) => {
  return (
    <Modal
      open={isOpen}
      className={className}
      onCancel={onDidDismiss}
      {...rest}
    />
  );
};

interface IonInputProps extends Omit<InputProps, 'onChange' | 'ref'> {
  value?: string;
  onIonInput?: (e: { detail: { value: string | number | null } }) => void;
}

export const IonInput = React.forwardRef<InputRef, IonInputProps>(
  ({ value, onIonInput, className, ...rest }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onIonInput?.({ detail: { value: e.target.value } })}
        className={className}
        {...rest}
      />
    );
  }
);

IonInput.displayName = 'IonInput';

interface IonSpinnerProps {
  name?: 'crescent' | 'circular' | 'dots' | 'bubbles' | 'lines' | 'lines-small' | 'lines-sharp' | 'lines-sharp-small' | 'circular-small';
  color?: string;
  paused?: boolean;
  className?: string;
}

export const IonSpinner = ({ name, color, paused, className, ...rest }: IonSpinnerProps) => {
  const antdTip = name === 'crescent' ? undefined : name;
  
  const style: React.CSSProperties = color ? { color } : {};
  
  return (
    <Spin
      spinning={!paused}
      tip={antdTip}
      size={name?.includes('small') ? 'small' : 'default'}
      style={style}
      className={className}
      {...rest}
    />
  );
};