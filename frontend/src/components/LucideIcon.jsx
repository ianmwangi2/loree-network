import React from 'react';
import * as Icons from 'lucide-react';

export const LucideIcon = ({ name, ...props }) => {
  // Map some custom names or fix names if needed
  let IconComponent = Icons[name];
  
  if (!IconComponent) {
    // Fallback if icon not found
    switch (name) {
      case 'CheckSquare':
        IconComponent = Icons.CheckSquare || Icons.SquareCheckBig;
        break;
      case 'Home':
        IconComponent = Icons.Home || Icons.House;
        break;
      default:
        IconComponent = Icons.HelpCircle;
    }
  }

  return <IconComponent {...props} />;
};

export default LucideIcon;
