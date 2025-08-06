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
};
