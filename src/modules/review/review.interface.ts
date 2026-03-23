export type IReview = {
  _id?: string;
  userName: string;
  userProfileImg?: string;
  designation: string;
  rating: number;
  comment: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
