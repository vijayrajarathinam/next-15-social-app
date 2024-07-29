import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

export default function InfiniteScrollContainer({
  children,
  className,
  onBottomReached,
}: InfiniteScrollContainerProps) {
  const { ref: pageBottomEndRef } = useInView({
    rootMargin: "200px", // will have margin of 200 before trigger
    onChange: (inView) => inView && onBottomReached(),
  });

  return (
    <div className={className}>
      {children}
      <div ref={pageBottomEndRef} />
    </div>
  );
}
