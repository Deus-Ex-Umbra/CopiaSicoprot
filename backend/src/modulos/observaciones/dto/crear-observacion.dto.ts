import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearObservacionDto {
  @ApiProperty({ example: 'Revisar la ortografía del capítulo 2.' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  id_autor: number;

  @ApiProperty({ description: 'Número de página donde se encuentra la observación.', example: 4, required: false })
  @IsNumber()
  @IsOptional()
  pagina?: number;
  
  @ApiProperty({ example: 10.5, required: false })
  @IsNumber()
  @IsOptional()
  posicion_x?: number;

  @ApiProperty({ example: 25.2, required: false })
  @IsNumber()
  @IsOptional()
  posicion_y?: number;

  @ApiProperty({ example: 30, required: false })
  @IsNumber()
  @IsOptional()
  ancho?: number;

  @ApiProperty({ example: 5.5, required: false })
  @IsNumber()
  @IsOptional()
  alto?: number;
}