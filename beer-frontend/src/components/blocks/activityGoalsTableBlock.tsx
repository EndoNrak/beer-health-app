import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ActivityGoalModel } from '../../models/activityGoalModel';

const columns: ColumnProps<ActivityGoalModel>[] = [
  {
    title: 'Goal Id',
    dataIndex: 'GoalId',
    key: 'GoalId',
  },
  {
    title: 'Category',
    dataIndex: 'Category',
    key: 'Category',
  },
  {
    title: 'TargetValue',
    dataIndex: 'TargetValue',
    key: 'TargetValue',
  },

  {
    title: 'Created At',
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    render: (createdAt: number) => new Date(createdAt*1000).toLocaleString(),
  },
];

// Define the functional component to display the table
const ActivityGoalTable: React.FC<{ data: ActivityGoalModel[] }> = ({ data }) => {
  return (
    <Table<ActivityGoalModel>
      dataSource={data}
      columns={columns}
      rowKey="GoalId"
      pagination={false}
    />
  );
};

export default ActivityGoalTable;
