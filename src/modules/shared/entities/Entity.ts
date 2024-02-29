import { PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

abstract class Entity {
  @PrimaryColumn()
  id: string;

  constructor() {
    this.id = v4();
  }
}

export { Entity };
