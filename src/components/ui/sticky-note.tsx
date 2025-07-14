import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/utils/utils';

interface IProps {
    title: string
    content: string
    footer?: string
    color?: string
    className?: string
}

const StickyNote = ({title, content, color = 'bg-yellow-200', className, ...props}: IProps) => {
    return (
        <Card className={cn("w-fit min-w-3xs max-w-md h-fit shadow-lg gap-1 rounded-xs", color, className)} {...props}>
            <CardHeader>
                <CardTitle className="text-md font-semibold leading-tight line-clamp-2 overflow-hidden text-ellipsis">{title}</CardTitle>
            </CardHeader>
            <CardContent className=''>
                <p>{content}</p>
            </CardContent>
        </Card>
    );
};

export default StickyNote;