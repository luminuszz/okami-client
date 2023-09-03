export interface Work {
  id: string;
  name: string;
  url: string;
  hasNewChapter: boolean;
  chapter: number;
  isFinished: boolean;
  imageId: string | null;
  imageUrl: string | null;
  nextChapterUpdatedAt: string | null;
  nextChapter: number | null;
  category: string;
}
