import {useEffect, useMemo, useState} from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender, ColumnDef, CellContext, SortingState,
} from '@tanstack/react-table';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import {Pencil, Trash2} from "lucide-react";
import axios from "axios";
import {API_BASE_URL} from "../../config.ts";





type User = {
    id: number;
    age: number;
    name: string;
    gender: string;
    email: string;
    status: string;
};


export default function DataTable() {
    const [data, setData] = useState<User[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchUsers(globalFilter);
    }, []);

    useEffect(() => {
        // 검색어 바뀔 때마다 자동 조회 (선택)
        fetchUsers(globalFilter);
    }, [globalFilter]);

    const fetchUsers = async (filter: string) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/getUserList`, {
                search: filter,  // 서버에서 이 키워드에 맞춰 구현되어 있어야 함
            });
            setData(response.data);
        } catch (error) {
            console.error('회원 목록 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };


    const columns: ColumnDef<User>[] = useMemo(() => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'age', header: '나이' },
        { accessorKey: 'name', header: '이름' },
        { accessorKey: 'gender', header: '성별' },
        { accessorKey: 'email', header: '이메일' },
        { accessorKey: 'status', header: '상태' },
        {
            id: 'actions',
            header: '액션',
            cell: (info: CellContext<User, number>) => {
                const rowData = info.row.original;
                return (
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(rowData)} title="수정">
                            <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(rowData)} title="삭제">
                            <Trash2 size={15} />
                        </button>
                    </div>
                );
            }
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
    });

    const downloadCSV = () => {
        const csv = Papa.unparse({
            fields: ['ID', '나이', '이름', '성별', '이메일', '상태'],
            data: data.map(row => [
                row.id, row.age, row.name, row.gender, row.email, row.status
            ])
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'table-data.csv');
    };


    const handleEdit = (user: User) => {
        alert(`수정: ${user.name}`);
        // TODO: 수정 모달 열기 또는 페이지 이동
    };

    const handleDelete = (user: User) => {
        if (window.confirm(`${user.name}을 삭제하시겠습니까?`)) {
            alert('삭제 요청 전송됨 (실제로는 데이터에서 제거)');
            // TODO: setData로 상태 업데이트 or API 호출
        }
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h4 className="text-xl font-semibold text-black">회원 목록</h4>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                        value={globalFilter ?? ''}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            // 검색어가 바뀌자마자 POST 요청
                            fetchUsers(e.target.value);
                        }}
                    />
                    <button
                        onClick={downloadCSV}
                        className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                        Download
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="bg-gray-200 text-left">
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="cursor-pointer px-4 py-4 text-sm font-medium text-black"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === 'asc'
                                        ? ' 🔼'
                                        : header.column.getIsSorted() === 'desc'
                                            ? ' 🔽'
                                            : ''}
                                </th>
                            ))}
                        </tr>

                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border-b border-[#eee] px-4 py-4 text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            <div className="mt-4 flex justify-between items-center text-sm">
        <span>
          페이지 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        이전
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}
