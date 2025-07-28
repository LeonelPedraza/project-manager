import { useState } from "react"
import { useParams } from "react-router"
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
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

import type { Invitation } from "@/types/types"
import { DeleteInvitationModal } from "../modals/members/delete-invitation"
import { useMembers } from "@/hooks/members/use-member"
import { SearchInput } from "../ui/search-input"
import { AddMemberModal } from "../modals/members/add-members"

export const InvitationssTable = () => {

    const { projectId } = useParams()
    const { invitations: { data, isLoading } } = useMembers(projectId)

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Invitation>[] = [
        {
            accessorKey: 'invited_email',
            id: 'invited_email',
            header: 'Email',
        },
        {
            accessorKey: 'invited_by_user_id.username',
            id: 'invited_by_user_id',
            header: 'Invited by',
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: 'Status',
        },
        {
            accessorKey: 'roles.name',
            id: 'role',
            header: 'Role',
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const invitation = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DeleteInvitationModal invitation={invitation} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
          },
    ]

    const table = useReactTable({
        data: data ?? [],
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
                <div className="flex flex-col md:flex-row justify-between py-4 w-full gap-2">
                    <SearchInput
                        placeholder="Find invited user..."
                        value={(table.getColumn("invited_email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("invited_email")?.setFilterValue(event.target.value)
                        }
                    />
                    <AddMemberModal />
                </div>
            </div>
            <div className="rounded-md">
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