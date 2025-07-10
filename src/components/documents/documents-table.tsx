import { useState } from "react"
import { useParams } from "react-router"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type ColumnFiltersState } from "@tanstack/react-table"
import { Folder as FolderIcon, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import type { Folder } from "@/types/types"
import { useFolder } from "@/hooks/documents/use-folder"
import { useSelectedProject } from "@/hooks/use-selected-project"


export const DocumentsTable = () => {

    const { projectId } = useParams()
    const { selectedProjectPermissions } = useSelectedProject()
    const { folders, isLoading } = useFolder(projectId ?? '')

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Folder>[] = [
        { 
            accessorKey: 'name', 
            header: 'Name',
            cell: ({ row }) => (
                <div className="flex gap-4 flex-1">
                    <FolderIcon />
                    {row.getValue('name')}
                </div>
            )
        }, 
        {
            id: "actions",
            cell: () => {
                const canUpdate = selectedProjectPermissions.has('documents:update')
                const canDelete = selectedProjectPermissions.has('documents:delete')
                if (canUpdate && canDelete) {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {
                                    canUpdate &&
                                    <DropdownMenuItem
                                        onClick={() => {}}
                                    >
                                        Change role
                                    </DropdownMenuItem>
                                }
                                {
                                    canUpdate && canDelete &&
                                    <DropdownMenuSeparator />
                                }
                                {
                                    canDelete &&
                                    <DropdownMenuItem
                                        onClick={() => { }}
                                    >
                                        Change role
                                    </DropdownMenuItem>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
            },
        }
    ]

    const table = useReactTable({
        data: folders ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        }
    })

    return (
        <div className="max-w-dvw overflow-x-auto">
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
    )
}