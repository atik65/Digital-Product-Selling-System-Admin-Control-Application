import  { useCallback, useState } from 'react'

const useSelect = () => {
    const [selectedRows, setSelectedRows] = useState([]);
  
    const handleRowSelect = useCallback((rowId) => {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(rowId)) {
          return prevSelectedRows.filter((currId) => currId !== rowId);
        } else {
          return [...prevSelectedRows, rowId];
        }
      });
    }, []);
    const handleSelectAll = useCallback((data = []) => {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.length === data?.length) {
          return [];
        } else {
          return data.map((row) => row._id);
        }
      });
    }, []);
    const handleUnselectAll = useCallback(
      () => selectedRows.length && setSelectedRows([]),
      [selectedRows.length]
    );
    return { selectedRows, handleRowSelect, handleSelectAll, handleUnselectAll };
  };

export default useSelect