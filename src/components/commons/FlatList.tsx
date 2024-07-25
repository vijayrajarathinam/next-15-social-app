import { Children, ReactElement, ReactNode } from "react";

interface FlatListProps<T> {
  of: T[];
  render: (item: T, index: number) => ReactElement;
}

export default function FlatList<T>({ render, of }: FlatListProps<T>) {
  return Children.toArray(of.map((item, index) => render(item, index)));
}
