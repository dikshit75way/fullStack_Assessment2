import React from 'react';

interface RenderIfProps {
  condition: boolean;
  render: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RenderIf: React.FC<RenderIfProps> = ({ condition, render, fallback = null }) => {
  return condition ? <>{render}</> : <>{fallback}</>;
};
