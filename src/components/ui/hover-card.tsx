import React from 'react';
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HoverCardProps {
  trigger: React.ReactNode;
  title?: string;
  content: React.ReactNode;
  className?: string;
}

const HoverCard: React.FC<HoverCardProps> = ({ 
  trigger, 
  title, 
  content, 
  className 
}) => {
  return (
    <HoverCardPrimitive.Root>
      <HoverCardPrimitive.Trigger asChild>
        {trigger}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Content 
        side="top"
        align="start"
        className={cn(
          "z-50 w-72 p-0 shadow-xl border rounded-lg overflow-hidden",
          className
        )}
      >
        <Card className="w-full border-none shadow-none">
          {title && (
            <CardHeader className="bg-muted/50 py-2 px-4 border-b">
              <CardTitle className="text-sm font-medium text-foreground">
                {title}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-4 text-sm text-muted-foreground">
            {content}
          </CardContent>
        </Card>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};

// Composants individuels pour une utilisation plus flexible
const HoverCardTrigger = HoverCardPrimitive.Trigger
const HoverCardContent = HoverCardPrimitive.Content

export { HoverCard, HoverCardTrigger, HoverCardContent }
