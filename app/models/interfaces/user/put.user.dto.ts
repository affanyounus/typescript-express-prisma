export interface PutUserDto {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    updatedAt?: Date;
}