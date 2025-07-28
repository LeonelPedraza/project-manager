import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { MoreHorizontal } from 'lucide-react';
import { useSelectedProject } from '@/hooks/use-selected-project';
import { EditNoteModal } from '../modals/notes/edit-note';
import type { Note } from '@/types/types';
import { DeleteNoteModal } from '../modals/notes/delete-note';

interface IProps {
    note: Note
}

const StickyNote = ({ note }: IProps) => {

    const { title, description, color } = note
    const { selectedProjectPermissions } = useSelectedProject()
    const canUpdate = selectedProjectPermissions.has('notes:update')
    const canDelete = selectedProjectPermissions.has('notes:delete')

    return (
        <Card className={`w-full shadow-lg rounded bg-${color}-200`}>
            <CardHeader className='w-full flex items-center justify-between'>
                <CardTitle className='text-black'>{title}</CardTitle>
                <CardAction>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={`w-6 h-6 outline-none`}>
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 outline-none text-black" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            {
                                canUpdate &&
                                <EditNoteModal note={note} />
                            }
                            {
                                canUpdate && canDelete &&
                                <DropdownMenuSeparator />
                            }
                            {
                                canDelete &&
                                <DeleteNoteModal noteId={note.id} noteTitle={note.title} />
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>
            <CardContent className=''>
                <p className="line-clamp-3 text-ellipsis text-sm text-black">{description}</p>
            </CardContent>
        </Card>
    );
};

export default StickyNote;