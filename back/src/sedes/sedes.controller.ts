import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  @Roles('jefe')
  create(@Body() createSedeDto: CreateSedeDto) {
    return this.sedesService.create(createSedeDto);
  }

  @Get()
  findAll() {
    return this.sedesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sedesService.findOne(id);
  }

  @Patch(':id')
  @Roles('jefe')
  update(@Param('id') id: string, @Body() updateSedeDto: UpdateSedeDto) {
    return this.sedesService.update(id, updateSedeDto);
  }

  @Delete(':id')
  @Roles('jefe')
  remove(@Param('id') id: string) {
    return this.sedesService.remove(id);
  }
}
