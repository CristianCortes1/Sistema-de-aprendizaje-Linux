import { IsString, IsNotEmpty, ValidateNested, IsArray, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateComandoDto {
	@IsString()
	@IsNotEmpty()
	comando: string;
}

export class CreateRetoDto {
	@IsString()
	@IsNotEmpty()
	descripcion: string;

	@IsOptional()
	@IsString()
	Retroalimentacion?: string;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateComandoDto)
	comandos: CreateComandoDto[];
}

export class CreateLessonDto {
	@IsString()
	@IsNotEmpty()
	titulo: string;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateRetoDto)
	retos: CreateRetoDto[];
}
