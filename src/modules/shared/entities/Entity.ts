import { v4 } from "uuid"
import {PrimaryColumn} from 'typeorm'

abstract class Entity {
    @PrimaryColumn()
    id: string

    constructor() {
        this.id = v4();
    }
}

export {Entity}