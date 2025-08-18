import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useMembers } from "@/hooks/members/use-member"
import { ChangeRoleModal } from "./change-role"
import { useParams } from "react-router"
import { useUser } from "@/hooks/use-user"
import { useSelectedProject } from "@/hooks/use-selected-project"
import { DeleteMemberModal } from "./delete-member"
import { SearchInput } from "../ui/search-input"
import { AddMemberModal } from "./add-members"

export const MembersTable = () => {

    const { projectId } = useParams()
    const { user } = useUser()
    const { selectedProjectPermissions } = useSelectedProject()

    const { members: { data, isLoading } } = useMembers(projectId)

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false)
    const [changeRoleModalMemberId, setChangeRoleModalMemberId] = useState<string>('')

    const handleChangeRole = (memberId: string) => {
        setChangeRoleModalMemberId(memberId)
        setChangeRoleModalOpen(true)
    }

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
        {
            id: "actions",
            cell: ({ row }) => {
                const member = row.original
                const canUpdate = selectedProjectPermissions.has('members:update')
                const canDelete = selectedProjectPermissions.has('members:delete')
                if (user?.id !== member.profiles.id && canUpdate && canDelete) {
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
                                        onClick={() => handleChangeRole(member.id ?? '')}
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
                                    <DeleteMemberModal memberId={member.id ?? ''} memberName={member.profiles.username ?? ''} />
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
            },
        }
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
                        placeholder="Find a member..."
                        value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
                    />
                    {
                        selectedProjectPermissions.has('members:create') &&
                        <AddMemberModal />
                    }
                </div>
            </div>
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
            <ChangeRoleModal memberId={changeRoleModalMemberId} open={changeRoleModalOpen} onClose={() => setChangeRoleModalOpen(false)} />
        </>
    )
}