import { useState } from "react"
import { useProjectMembers } from "@/hooks/projects/use-project-memebers"
import { useAppState } from "@/hooks/use-app-state"
import type { ProjectMember } from "@/types/types"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnFiltersState,
    getFilteredRowModel
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export const MembersTable = () => {

    const { selectedProject } = useAppState()
    const { projectMembers, isLoading } = useProjectMembers(selectedProject?.project.id || '')

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])


    const columns: ColumnDef<ProjectMember>[] = [
        {
            accessorKey: 'profiles.avatar_url',
            id: 'avatar',
            header: 'Avatar',
            cell: ({ row }) => <img src={row.getValue('avatar')} alt="Avatar" className="w-8 h-8 rounded-full" />,
        },
        {
            accessorKey: 'profiles.username',
            id: 'username',
            header: 'Username',
        },
        {
            accessorKey: 'roles.name',
            id: 'role',
            header: 'Role',
        },
    ]

    const table = useReactTable({
        data: projectMembers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        }
    })

    return (
        <>
            <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4">
                <div className="flex items-center py-4 w-full">
                    <Input
                        placeholder="Filter members..."
                        value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("username")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </>
    )
}