import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemRepository } from './item.repository';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemRepository)
    private readonly itemRepository: ItemRepository,
  ) {}

  async findAll(): Promise<Item[]> {
    try {
      return await this.itemRepository.findAll();
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string): Promise<Item> {
    try {
      const item = await this.itemRepository.findById(id);
      if (!item) {
        throw new NotFoundException();
      }
      return item;
    } catch (e) {
      throw e;
    }
  }

  async create(createItemDto: CreateItemDto, user: User): Promise<Item> {
    try {
      return await this.itemRepository.createItem(createItemDto, user);
    } catch (e) {
      throw e;
    }
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    try {
      const item = await this.itemRepository.updateStatus(id, user);
      if (!item) {
        throw new BadRequestException('自身の商品を購入することはできません');
      }
      return item;
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string, user: User): Promise<void> {
    try {
      const result = await this.itemRepository.destroy(id, user);
      if (!result) {
        throw new BadRequestException('他人の商品を削除することはできません');
      }
    } catch (e) {
      throw e;
    }
  }
}
