export type courseSchemaType = {
  title: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  status: String;
};

export type ApiResponse = {
  status: string;
  message: String;
  data?: [];
};

export type ChapterWithLessonsType = {
  id: string;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  lesson: {
    id: string;
    title: string;
    description: string | null;
    thumbnailKey: string | null;
    videoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    chapterId: string;
  }[];
};
