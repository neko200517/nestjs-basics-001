import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ItemsService } from '../items/items.service';
import { ItemRepository } from '../items/item.repository';
import { UserStatus } from '../auth/user-status.enum';
import { ItemStatus } from '../items/item-status.enum';
import { Item } from '../entities/item.entity';

const mockUser1 = {
  id: '1',
  username: 'test1',
  password: 'test1',
  status: UserStatus.PREMIUM,
};

const mockUser2 = {
  id: '2',
  username: 'test2',
  password: 'test2',
  status: UserStatus.FREE,
};

// 関数名を抽出してモック関数にマッピングする
const getMockMethods = (className: any) => {
  const methodNames = Object.getOwnPropertyNames(className.prototype).filter(
    (name) => name !== 'constructor',
  );
  return methodNames.reduce((acc, methodName) => {
    return { ...acc, [methodName]: jest.fn(() => Item) };
  }, {});
};

describe('ItemsServiceTest', () => {
  let itemsService;
  let itemRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(ItemRepository),
          useValue: getMockMethods(ItemRepository),
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<ItemRepository>(
      getRepositoryToken(ItemRepository),
    );
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const expected: Item[] = [];
      jest
        .spyOn(itemRepository, 'findAll')
        .mockImplementation(async () => expected);
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      jest
        .spyOn(itemRepository, 'findById')
        .mockImplementation(async () => expected);
      const result = await itemsService.findById('tesst-id');

      expect(result).toEqual(expected);
    });

    it('異常系: 商品が存在しない', async () => {
      jest
        .spyOn(itemRepository, 'findById')
        .mockImplementation(async () => null);
      await expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      const item = {
        name: 'PC',
        price: 50000,
        description: '',
      };

      jest
        .spyOn(itemRepository, 'createItem')
        .mockImplementation(async () => expected);
      const result = await itemsService.create(item, mockUser1);

      expect(result).toEqual(expected);
    });
  });

  describe('updateStatus', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 50000,
      description: '',
      status: ItemStatus.SOLD_OUT,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('正常系', async () => {
      jest
        .spyOn(itemRepository, 'updateStatus')
        .mockImplementation(async () => mockItem);
      await expect(
        itemsService.updateStatus('test-id', mockUser2),
      ).resolves.toEqual(mockItem);
    });

    it('異常系: 自身の商品を購入', async () => {
      jest
        .spyOn(itemRepository, 'updateStatus')
        .mockImplementation(async () => null);
      await expect(
        itemsService.updateStatus('test-id', mockUser1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 50000,
      description: '',
      status: ItemStatus.SOLD_OUT,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('正常系', async () => {
      jest
        .spyOn(itemRepository, 'destroy')
        .mockImplementation(async () => mockItem);
      await expect(itemsService.delete('test-id', mockUser1)).resolves.toEqual(
        undefined,
      );
    });

    it('異常系: 他人の商品を削除', async () => {
      jest
        .spyOn(itemRepository, 'destroy')
        .mockImplementation(async () => null);
      await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
