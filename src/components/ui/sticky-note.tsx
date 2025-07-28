import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/utils/utils';

interface IProps {
    title: string
    description: string
    color?: string
    className?: string
}

const StickyNote = ({title, description, color = 'bg-yellow-200', className, ...props}: IProps) => {
    return (
        <Card className={cn("w-full shadow-lg gap-1 rounded-xs", `bg-${color}-200`, className)} {...props}>
            <CardHeader>
                <CardTitle className="text-md font-semibold leading-tight line-clamp-2 overflow-hidden text-ellipsis">{title}</CardTitle>
            </CardHeader>
            <CardContent className=''>
                <p className="line-clamp-3 text-ellipsis text-sm">{description}</p>
            </CardContent>
        </Card>
    );
};

export default StickyNote;