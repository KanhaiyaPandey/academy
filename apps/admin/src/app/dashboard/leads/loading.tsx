import { Card, Skeleton, Row, Col } from "antd";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-44 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={12} lg={6} key={i}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Skeleton active paragraph={{ rows: 7 }} />
      </Card>
    </div>
  );
}
