import { IconType } from 'react-icons';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type EmptyStateProps = {
  icon: IconType;
  title: string;
  description: string;
};

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
