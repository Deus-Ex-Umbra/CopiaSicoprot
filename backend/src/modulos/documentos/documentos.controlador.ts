import { Controller, Post, Param, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentosService } from './documentos.servicio';
import { diskStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('documentos')
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly servicio_documentos: DocumentosService) {}

  @Post('subir/:proyectoId')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Subir un documento a un proyecto' })
  @ApiParam({ name: 'proyectoId', description: 'ID numérico del proyecto al que pertenece el documento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      properties: {
        archivo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Documento subido y registrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'El proyecto especificado no fue encontrado.' })
  subirDocumento(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    return this.servicio_documentos.guardarRegistro(proyectoId, archivo);
  }
}