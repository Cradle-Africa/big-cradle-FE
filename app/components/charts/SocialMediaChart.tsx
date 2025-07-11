'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

const SocialMediaChart = ({ data }: Props) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#578CFF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SocialMediaChart;
