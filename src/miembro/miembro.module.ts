import { Module } from '@nestjs/common';
import { MiembroService } from './miembro.service';
import { MiembroController } from './miembro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Miembro } from './miembro.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Miembro])],
  providers: [MiembroService],
  controllers: [MiembroController],
  exports: [MiembroService]
})
export class MiembroModule {}
