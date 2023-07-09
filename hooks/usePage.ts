import { useAtom } from "jotai";
import { pagesAtom } from "../store";

export default function usePage(pageDomain: string) {
  const [pages, setPages] = useAtom(pagesAtom)

  return {
    page: pages[pageDomain],
    setPage: (page: any) => setPages(pagesValue => ({ ...pagesValue, [pageDomain]: page }))
  }
}