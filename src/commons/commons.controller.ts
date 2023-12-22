import { Body, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { BaseService } from './commons.service';

export abstract class BaseController<T> {
  abstract getService(): BaseService<T>;

  @Get('all')
  async findAll(@Query() query: any): Promise<T[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    return await this.getService().findAll(relations);
  }

  @Get('find/:id')
  async findOne(@Param('id') id): Promise<T> {
    return await this.getService().findOne({ id });
  }

  @Get('findAllBy')
  async findAllBy(@Query() query?: any): Promise<T[]> {
    const relations: string[] = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    
    return await this.getService().findAllBy(filteredQuery, relations);
  }

  @Post('save')
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() entity: T): Promise<T> {
    return await this.getService().save(entity);
  }

  @Post('save/many')
  @HttpCode(HttpStatus.CREATED)
  async saveMany(@Body() entities: T[]): Promise<T[]> {
    return await this.getService().saveMany(entities);
  }

  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: any) {
    return this.getService().delete(id);
  }

  @Get('count')
  async count(): Promise<number> {
    return await this.getService().count();
  }
}
