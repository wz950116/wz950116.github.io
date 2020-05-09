import React from 'react';
import './App.css';
import { Table, Tag, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import dataSource from './pvx_mounts.json';
import dataDescription from './description.json';

function swapArr(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// 检索
let searchState = {
  searchText: '',
  searchedColumn: ''
}

function handleSearch(selectedKeys, confirm, dataIndex) {
  confirm();
  searchState = {
    searchText: selectedKeys[0],
    searchedColumn: dataIndex,
  };
};

function handleReset(clearFilters) {
  clearFilters();
  searchState = { searchText: '' };
};

let searchInput = null;

function getColumnSearchProps(dataIndex) {
  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: text => searchState.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchState.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ) : (
      text
    )
  }
};

// 展开
const expandable = { expandedRowRender: record => <p>{dataDescription[record.name]}</p> };

function App() {
  const state = {
    expandable,
    loading: false,
    size: 'small'
  }

  // 排序
  const _filters = [], filters = []
  dataSource.forEach(v => {
    if (!_filters.includes(v.name)) {
      _filters.push(v.name)
      filters.push({
        text: v.name,
        value: v.name,
        speed: v.speed.replace('%', '')
      })
    }
  });
  filters.sort((a, b) => {
    return a.speed - b.speed
  })

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      filters,
      onFilter: (value, record) => record.name.indexOf(value) === 0
    },
    {
      title: '后缀',
      dataIndex: 'suffix',
      align: 'center'
    },
    {
      title: '移动速度',
      dataIndex: 'speed',
      align: 'center',
      sorter: {
        compare: (a, b) => a.speed.replace('%', '') - b.speed.replace('%', '')
      }
    },
    {
      title: '综合速度',
      dataIndex: 'total_speed',
      align: 'center',
      sorter: {
        compare: (a, b) => a.total_speed.replace('%', '') - b.total_speed.replace('%', '')
      }
    },
    {
      title: '属性',
      dataIndex: 'tags',
      render: (text, row, index) => {
        const tags = [row.attrs_1, row.attrs_2, row.attrs_3]
        if (row.attrs_2.includes('劲足') || row.attrs_2.includes('匹马')) {
          const index = tags.indexOf(row.attrs_2)
          swapArr(tags, index, 0)
        }
        if (row.attrs_3.includes('劲足') || row.attrs_3.includes('匹马')) {
          const index = tags.indexOf(row.attrs_3)
          swapArr(tags, index, 0)
        }
        if (row.doubleRide === '1') tags.unshift('双骑')
        return (
          <span>
            {tags.map(tag => {
              if (!tag) return null;
              let color = tag === '双骑' ? 'volcano' : tag.includes('劲足') || tag.includes('匹马') ? 'geekblue' : 'green';
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      }
    },
    {
      title: '品质等级',
      dataIndex: 'grade',
      align: 'center'
    },
    {
      title: '成马UID',
      dataIndex: 'uid',
      ...getColumnSearchProps('uid')
    },
    {
      title: '马驹UID',
      dataIndex: 'child_uid',
      ...getColumnSearchProps('child_uid')
    }
  ];
  
  return (
    <Table {...state} columns={columns} dataSource={dataSource} pagination={false} />
  );
}

export default App;
