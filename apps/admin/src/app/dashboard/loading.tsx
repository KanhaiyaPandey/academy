import { Card, Row, Col, Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div>
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-80 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tables row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
      </Row>

      {/* Progress card */}
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    </div>
  );
}
