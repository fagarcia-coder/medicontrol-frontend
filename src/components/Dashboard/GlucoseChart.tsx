import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type Props = {
  data: Array<{ measurement_value: number; created_at: string }>;
};

const GlucoseChart: React.FC<Props> = ({ data }) => {
  // Map data to chart format (ensure sorted by date)
  const sorted = [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sorted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="created_at" tickFormatter={(d: string) => new Date(d).toLocaleDateString()} />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
        <Line type="monotone" dataKey="measurement_value" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GlucoseChart;
