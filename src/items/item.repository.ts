import { Item } from '../entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async findAll(): Promise<Item[]> {
    return await this.find();
  }

  async findById(id: string): Promise<Item> {
    return await this.findOneBy({ id });
  }

  async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const { name, price, description } = createItemDto;
    const item = this.create({
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user,
    });
    await this.save(item);
    return item;
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    const item = await this.findOneBy({ id });
    if (item.userId === user.id) {
      return null;
    }
    item.status = ItemStatus.SOLD_OUT;
    item.updatedAt = new Date().toISOString();
    return await this.save(item);
  }

  async destroy(id: string, user: User): Promise<Item> {
    const item = await this.findOneBy({ id });
    if (item.userId !== user.id) {
      return null;
    }
    return await this.remove(item);
  }
}
