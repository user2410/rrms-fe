import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropTypes from "prop-types";
import React from "react";

export default function StatCard({
  title,
  icon,
  data,
  statArrow,
  change,
  since,
}: {
  title: string;
  icon: React.ReactNode;
  data: string;
  statArrow: "up" | "down" | "none";
  change?: string;
  since?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data}</div>
        {statArrow === "up" ? (
          <div className="inline-block space-x-1 text-emerald-500">
            <i className="fas fa-arrow-up"/>
            <span>{change}</span>
          </div>
        ) : statArrow === "down" ? (
          <div className="inline-block space-x-1 text-red-500">
            <i className="fas fa-arrow-down"/>
            <span>{change}</span>
          </div>
        ) : (
          <div className="inline-block space-x-1 text-gray-500">
            <i className="fas fa-equals"/>
            <span>{change}</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">{since}</p>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down", "none"]),
  statPercent: PropTypes.string,
  // can be any of the text color utilities
  // from tailwindcss
  statPercentColor: PropTypes.string,
  statDescripiron: PropTypes.string,
  statIconName: PropTypes.string,
  // can be any of the background color utilities
  // from tailwindcss
  statIconColor: PropTypes.string,
};
