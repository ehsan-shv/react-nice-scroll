import { createGlobalState } from 'react-hooks-global-state';
import { Scrollbar } from 'smooth-scrollbar/scrollbar';

interface State {
  container: HTMLElement | HTMLDivElement | undefined;
  smoothScrollBar: Scrollbar | undefined;
  allowScroll: boolean;
}

export const { useGlobalState } = createGlobalState<State>({
  container: undefined,
  smoothScrollBar: undefined,
  allowScroll: true,
});
