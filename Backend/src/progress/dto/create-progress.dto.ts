import { IsInt, Min, Max } from 'class-validator';

export class CreateProgressDto {
    @IsInt()
    @Min(0)
    @Max(100)
    progress: number;

    @IsInt()
    userId: number;

    @IsInt()
    lessonId: number;
}
