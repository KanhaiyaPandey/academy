import { Card, Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    </div>
  );
}
